import { BadRequestException, Injectable } from '@nestjs/common';
import { UserHelper } from 'src/helpers/user';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJournalDto } from './dto/create.dto';
import { EditJournalDto } from './dto/edit.dto';

@Injectable()
export class JournalsService {
    constructor(private readonly prisma: PrismaService, private readonly userHelper: UserHelper) { }

    async create(data: CreateJournalDto) {
        const userId = this.userHelper.getUser();


        const journal = await this.prisma.journal.create({
            data: {
                ...data,
                userId
            }
        }).then(data => data).catch(err => {
            throw new BadRequestException(err);
        });

        return journal;


    }

    async getUserJournals() {
        const userId = this.userHelper.getUser();

        const journals = await this.prisma.journal.findMany({
            where: {
                userId
            },

            include: {
                category: {
                    select: {
                        name: true
                    }
                }
            },

            orderBy: {
                createdAt: 'desc'
            }
        }).then(data => data).catch(err => {
            throw new BadRequestException(err);
        });

        return journals
    }

    async updateJournal(data: EditJournalDto) {

        const journal = await this.prisma.journal.update({
            where: {
                id: data.id
            },
            data: {
                ...data,

            }
        }).then(data => data).catch(err => {
            throw new BadRequestException(err);
        });

        return journal;
    }

    async deleteJournal({ id }: EditJournalDto) {

        const journal = await this.prisma.journal.delete({
            where: {
                id
            }
        }).then(data => data).catch(err => {
            throw new BadRequestException(err);
        });

        return journal;
    }
}
