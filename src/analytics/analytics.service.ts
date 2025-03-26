import { BadRequestException, Injectable } from '@nestjs/common';
import { UserHelper } from 'src/helpers/user';
import { PrismaService } from 'src/prisma/prisma.service';
import * as dayjs from 'dayjs';
import { YearFreqDto } from './dto/year-freq';

@Injectable()
export class AnalyticsService {
    constructor(private readonly prisma: PrismaService, private readonly userHelper: UserHelper) { }

    async averageWordLength() {
        const userId = this.userHelper.getUser();

        const journals = await this.prisma.journal.findMany({
            where: {
                userId
            },

            select: {
                content: true
            }
        }).then(data => data).catch(err => {
            throw new BadRequestException(err);
        }
        );


        const totalWords = journals.reduce((sum, journal) => {
            const wordCount = journal.content.split(/\s+/).filter(Boolean).length;
            return sum + wordCount;
        }, 0)

        const average = totalWords / journals.length;

        return {
            average
        }

    }


    async longestStreak() {
        const userId = this.userHelper.getUser();

        const journals = await this.prisma.journal.findMany({
            where: { userId },
            orderBy: { createdAt: 'asc' }
        }).catch(err => {
            throw new BadRequestException(err);
        });

        if (journals.length === 0) {
            return { longestStreak: 0 };
        }

        let streak = 1;
        let longestStreak = 1;
        let lastDate = new Date(journals[0].createdAt);

        for (let i = 1; i < journals.length; i++) {
            const currentDate = new Date(journals[i].createdAt);
            const diffInDays = (currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);

            if (diffInDays === 1) {

                streak++;
                longestStreak = Math.max(longestStreak, streak);
            } else if (diffInDays > 1) {

                streak = 1;
            }

            lastDate = currentDate;
        }

        return { longestStreak };
    }


    async totalJournals() {
        const userId = this.userHelper.getUser();

        const totalJournals = await this.prisma.journal.count({
            where: {
                userId
            }
        }).catch(err => {
            throw new BadRequestException(err);
        });

        return {
            totalJournals
        }
    }

    async categoryDistribution() {
        const userId = this.userHelper.getUser();

        const categories = await this.prisma.journal.groupBy({
            by: ['categoryId'],
            where: { userId },
            _count: { id: true }
        }).catch(err => {
            throw new BadRequestException(err);
        });

        if (categories.length === 0) {
            return [];
        }

        const categoryNames = await this.prisma.category.findMany({
            where: { id: { in: categories.map(c => c.categoryId) } },
            select: { id: true, name: true }
        });


        return categories.map(category => ({
            category: categoryNames.find(c => c.id === category.categoryId)?.name || "Unknown",
            count: category._count.id
        }));
    }


    async wordCountTrends() {
        const userId = this.userHelper.getUser();

        const journals = await this.prisma.journal.findMany({
            where: { userId },
            orderBy: { createdAt: 'asc' },
            select: { createdAt: true, content: true }
        }).catch(err => {
            throw new BadRequestException(err);
        });

        if (journals.length === 0) {
            return [];
        }

        const wordCountByMonth: Record<string, { totalWords: number; entryCount: number }> = {};

        journals.forEach(journal => {
            const date = new Date(journal.createdAt);
            const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

            const wordCount = journal.content.split(/\s+/).filter(Boolean).length;

            if (!wordCountByMonth[month]) {
                wordCountByMonth[month] = { totalWords: 0, entryCount: 0 };
            }

            wordCountByMonth[month].totalWords += wordCount;
            wordCountByMonth[month].entryCount++;
        });

        return Object.entries(wordCountByMonth).map(([month, { totalWords, entryCount }]) => ({
            month,
            avgWordCount: Math.round(totalWords / entryCount),
            totalWords
        }));
    }



    async yearlyJournalFrequency({ year }: YearFreqDto) {
        const userId = this.userHelper.getUser();
        const selectedYear = year || dayjs().year();
        const today = dayjs();
        const isCurrentYear = selectedYear === today.year();

        const endDate = isCurrentYear ? today.endOf("day") : dayjs(`${selectedYear}-12-31`).endOf("day");
        const startDate = dayjs(`${selectedYear}-01-01`).startOf("day");

        const journals = await this.prisma.journal.findMany({
            where: {
                userId,
                createdAt: {
                    gte: startDate.toDate(),
                    lte: endDate.toDate(),
                },
            },
            orderBy: { createdAt: "asc" },
            select: { createdAt: true }
        }).catch(err => {
            throw new BadRequestException(err);
        });


        const journalCountByDate: Record<string, number> = {};
        const daysInRange = endDate.diff(startDate, "day") + 1;

        for (let i = 0; i < daysInRange; i++) {
            const date = startDate.add(i, "day").format("YYYY-MM-DD");
            journalCountByDate[date] = 0;
        }

        journals.forEach(journal => {
            const date = dayjs(journal.createdAt).format("YYYY-MM-DD");
            journalCountByDate[date] = (journalCountByDate[date] || 0) + 1;
        });

        return Object.entries(journalCountByDate).map(([date, count]) => ({
            date,
            count
        }));
    }


    async averageWordCountByCategory() {
        const userId = this.userHelper.getUser();

        const journals = await this.prisma.journal.findMany({
            where: { userId },
            select: {
                categoryId: true,
                content: true,
                category: {
                    select: { name: true }
                }
            }
        }).catch(err => {
            throw new BadRequestException(err);
        });


        const categoryStats: Record<string, { totalWords: number; count: number }> = {};

        journals.forEach(({ categoryId, content }) => {
            const wordCount = content.split(/\s+/).filter(Boolean).length;
            if (!categoryStats[categoryId]) {
                categoryStats[categoryId] = { totalWords: 0, count: 0 };
            }
            categoryStats[categoryId].totalWords += wordCount;
            categoryStats[categoryId].count += 1;
        });

        return Object.entries(categoryStats).map(([categoryId, { totalWords, count }]) => ({
            categoryId,
            categoryName: journals.find(j => j.categoryId === categoryId)?.category.name || "Unknown",
            averageWordCount: count ? Math.round(totalWords / count) : 0
        }));
    }


    async timeOfDayStats() {
        const userId = this.userHelper.getUser();

        const journals = await this.prisma.journal.findMany({
            where: { userId },
            select: { createdAt: true }
        }).catch(err => {
            throw new BadRequestException(err);
        });

        const timeOfDayStats = {
            morning: 0,
            afternoon: 0,
            evening: 0,
            night: 0
        };

        journals.forEach(({ createdAt }) => {
            const hour = dayjs(createdAt).hour();

            if (hour >= 5 && hour < 12) {
                timeOfDayStats.morning++;
            } else if (hour >= 12 && hour < 17) {
                timeOfDayStats.afternoon++;
            } else if (hour >= 17 && hour < 21) {
                timeOfDayStats.evening++;
            } else {
                timeOfDayStats.night++;
            }
        });

        return timeOfDayStats;
    }


}
