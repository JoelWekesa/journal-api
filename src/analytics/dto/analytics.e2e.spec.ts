import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AnalyticsService } from '../analytics.service';
import { AnalyticsController } from '../analytics.controller';

describe('AnalyticsController (e2e)', () => {
    let app: INestApplication;
    const mockAnalyticsService = {
        averageWordLength: jest.fn().mockResolvedValue({ average: 5 }),
        longestStreak: jest.fn().mockResolvedValue({ longestStreak: 3 }),
        totalJournals: jest.fn().mockResolvedValue({ totalJournals: 3 }),
        categoryDistribution: jest.fn().mockResolvedValue([
            { category: 'work', count: 1 },
            { category: 'personal', count: 2 },
        ]),
        wordCountTrends: jest.fn().mockResolvedValue([
            { month: '2021-01', totalWords: 10, avgWordCount: 5 },
        ]),
        yearlyJournalFrequency: jest.fn().mockResolvedValue([
            { date: '2021-01-01', count: 1 },
        ]),
        averageWordCountByCategory: jest.fn().mockResolvedValue([
            { categoryId: '1', categoryName: 'work', averageWordCount: 5 },
            { categoryId: '2', categoryName: 'personal', averageWordCount: 4 },
        ]),
        timeOfDayStats: jest.fn().mockResolvedValue({
            morning: 1,
            afternoon: 1,
            evening: 1,
            night: 1,
        }),
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [AnalyticsController],
            providers: [{ provide: AnalyticsService, useValue: mockAnalyticsService }],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('/analytics/average-word-count (GET)', () => {
        return request(app.getHttpServer())
            .get('/analytics/average-word-count')
            .expect(200)
            .expect({ average: 5 });
    });

    it('/analytics/longest-streak (GET)', () => {
        return request(app.getHttpServer())
            .get('/analytics/longest-streak')
            .expect(200)
            .expect({ longestStreak: 3 });
    });

    it('/analytics/total-journals (GET)', () => {
        return request(app.getHttpServer())
            .get('/analytics/total-journals')
            .expect(200)
            .expect({ totalJournals: 3 });
    });

    it('/analytics/category-distribution (GET)', () => {
        return request(app.getHttpServer())
            .get('/analytics/category-distribution')
            .expect(200)
            .expect([
                { category: 'work', count: 1 },
                { category: 'personal', count: 2 },
            ]);
    });

    it('/analytics/word-count-trend (GET)', () => {
        return request(app.getHttpServer())
            .get('/analytics/word-count-trend')
            .expect(200)
            .expect([
                { month: '2021-01', totalWords: 10, avgWordCount: 5 },
            ]);
    });

    it('/analytics/yearly-frequency (GET)', () => {
        return request(app.getHttpServer())
            .get('/analytics/yearly-frequency?year=2021')
            .expect(200)
            .expect([
                { date: '2021-01-01', count: 1 },
            ]);
    });

    it('/analytics/average-word-count-by-category (GET)', () => {
        return request(app.getHttpServer())
            .get('/analytics/average-word-count-by-category')
            .expect(200)
            .expect([
                { categoryId: '1', categoryName: 'work', averageWordCount: 5 },
                { categoryId: '2', categoryName: 'personal', averageWordCount: 4 },
            ]);
    });

    it('/analytics/time-of-day-stats (GET)', () => {
        return request(app.getHttpServer())
            .get('/analytics/time-of-day-stats')
            .expect(200)
            .expect({
                morning: 1,
                afternoon: 1,
                evening: 1,
                night: 1,
            });
    });
});
