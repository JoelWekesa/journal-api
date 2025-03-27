import { Test, TestingModule } from '@nestjs/testing';
import { UserHelper } from '../helpers/user';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {


  let service: AnalyticsService;

  const mockPrismaService = {
    journal: {
      findMany: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },

    category: {
      findMany: jest.fn()
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalyticsService, PrismaService, UserHelper],
    }).overrideProvider(PrismaService).useValue(mockPrismaService).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it("should return average word length", async () => {
    mockPrismaService.journal.findMany.mockResolvedValue([
      { content: "This is a test journal" },
      { content: "This is another test journal" }
    ]);

    const result = await service.averageWordLength();
    expect(result).toEqual({ average: 5 });
  });


  it("should return longest streak", async () => {

    mockPrismaService.journal.findMany.mockResolvedValue([
      { createdAt: new Date("2021-01-01") },
      { createdAt: new Date("2021-01-02") },
      { createdAt: new Date("2021-01-03") },
      { createdAt: new Date("2021-01-05") },
      { createdAt: new Date("2021-01-06") },
    ]);

    const result = await service.longestStreak();
    expect(result).toEqual({ longestStreak: 3 });
  });


  it('should return total journals', async () => {
    mockPrismaService.journal.count.mockResolvedValue(3);

    const result = await service.totalJournals();

    expect(result).toBeDefined();
    expect(result).toEqual({ totalJournals: 3 });
  });


  it('should return journal distribution by category', async () => {
    mockPrismaService.journal.groupBy.mockResolvedValue([
      {
        categoryId: 1,
        _count: { id: 1 }
      },
      {
        categoryId: 2,
        _count: { id: 2 }
      }
    ]);

    mockPrismaService.journal.findMany.mockResolvedValue([
      { category: "work" },
      { category: "personal" },
    ]);

    mockPrismaService.category = {
      findMany: jest.fn().mockResolvedValue([
        { id: 1, name: "work" },
        { id: 2, name: "personal" },
      ]),
    };

    const result = await service.categoryDistribution();

    expect(result).toBeDefined();
    expect(result).toEqual([
      { category: "work", count: 1 },
      { category: "personal", count: 2 },
    ]);
  })


  it('should return word count trends', async () => {
    mockPrismaService.journal.findMany.mockResolvedValue([
      { content: "This is a test journal", createdAt: new Date("2021-01-01") },
      { content: "This is another test journal", createdAt: new Date("2021-01-02") },
    ]);

    const result = await service.wordCountTrends();

    expect(result).toBeDefined();
    expect(result).toEqual([
      {
        month: '2021-01',
        totalWords: 10,
        avgWordCount: 5
      }
    ]);
  })

  it('should return yearly journal frequency', async () => {
    mockPrismaService.journal.groupBy.mockResolvedValue([
      {
        _count: { id: 1 },
        createdAt: new Date("2021-01-01")
      },
    ]);

    const result = await service.yearlyJournalFrequency({ year: 2021 });

    expect(result).toBeDefined();
    expect(result).toEqual(
      expect.arrayContaining([
        { date: '2021-01-01', count: 1 }
      ])
    )
  })

  it('should return average word count by category', async () => {
    mockPrismaService.journal.findMany.mockResolvedValue([
      {
        categoryId: "1",
        content: "This is a test journal",
        category: { name: "work" }
      },
      {
        categoryId: "2",
        content: "Another test journal with more words",
        category: { name: "personal" }
      },
      {
        categoryId: "2",
        content: "Short text",
        category: { name: "personal" }
      }
    ]);

    const result = await service.averageWordCountByCategory();

    expect(result).toBeDefined();
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ categoryId: "1", categoryName: "work", averageWordCount: 5 }),
        expect.objectContaining({ categoryId: "2", categoryName: "personal", averageWordCount: 4 }),
      ])
    );
  });


  it('should get time of day stats', async () => {

    mockPrismaService.journal.findMany.mockResolvedValue([
      { createdAt: new Date("2021-01-01T08:00:00") },
      { createdAt: new Date("2021-01-01T12:00:00") },
      { createdAt: new Date("2021-01-01T18:00:00") },
      { createdAt: new Date("2021-01-01T22:00:00") },
    ]);

    const result = await service.timeOfDayStats();

    expect(result).toBeDefined();
    expect(result).toEqual(
      { "afternoon": 1, "evening": 1, "morning": 1, "night": 1 }
    );
  })

});
