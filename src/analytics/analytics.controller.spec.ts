import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;

  const mockAnalyticsService = {
    averageWordLength: jest.fn(),
    longestStreak: jest.fn(),
    totalJournals: jest.fn(),
    categoryDistribution: jest.fn(),
    wordCountTrends: jest.fn(),
    yearlyJournalFrequency: jest.fn(),
    averageWordCountByCategory: jest.fn(),
    timeOfDayStats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [{ provide: AnalyticsService, useValue: mockAnalyticsService }],
    }).compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return average word length', async () => {
    mockAnalyticsService.averageWordLength.mockResolvedValue({ average: 5 });

    const result = await controller.averageWordLength();
    expect(result).toEqual({ average: 5 });
  });

  it('should return longest streak', async () => {
    mockAnalyticsService.longestStreak.mockResolvedValue({ longestStreak: 3 });

    const result = await controller.longestStreak();
    expect(result).toEqual({ longestStreak: 3 });
  });

  it('should return total journals', async () => {
    mockAnalyticsService.totalJournals.mockResolvedValue({ totalJournals: 3 });

    const result = await controller.totalJournals();
    expect(result).toEqual({ totalJournals: 3 });
  });

  it('should return journal distribution by category', async () => {
    mockAnalyticsService.categoryDistribution.mockResolvedValue([
      { category: 'work', count: 1 },
      { category: 'personal', count: 2 },
    ]);

    const result = await controller.categoryDistribution();
    expect(result).toEqual([
      { category: 'work', count: 1 },
      { category: 'personal', count: 2 },
    ]);
  });

  it('should return word count trends', async () => {
    mockAnalyticsService.wordCountTrends.mockResolvedValue([
      { month: '2021-01', totalWords: 10, avgWordCount: 5 },
    ]);

    const result = await controller.weeklyWordCountTrends();
    expect(result).toEqual([
      { month: '2021-01', totalWords: 10, avgWordCount: 5 },
    ]);
  });

  it('should return yearly journal frequency', async () => {
    mockAnalyticsService.yearlyJournalFrequency.mockResolvedValue([
      { date: '2021-01-01', count: 1 },
    ]);

    const result = await controller.yearlyJournalFrequency({ year: 2021 });
    expect(result).toEqual([
      { date: '2021-01-01', count: 1 },
    ]);
  });

  it('should return average word count by category', async () => {
    mockAnalyticsService.averageWordCountByCategory.mockResolvedValue([
      { categoryId: '1', categoryName: 'work', averageWordCount: 5 },
      { categoryId: '2', categoryName: 'personal', averageWordCount: 4 },
    ]);

    const result = await controller.averageWordCountByCategory();
    expect(result).toEqual([
      { categoryId: '1', categoryName: 'work', averageWordCount: 5 },
      { categoryId: '2', categoryName: 'personal', averageWordCount: 4 },
    ]);
  });

  it('should return time of day stats', async () => {
    mockAnalyticsService.timeOfDayStats.mockResolvedValue({
      morning: 1,
      afternoon: 1,
      evening: 1,
      night: 1,
    });

    const result = await controller.timeOfDayStats();
    expect(result).toEqual({
      morning: 1,
      afternoon: 1,
      evening: 1,
      night: 1,
    });
  });
});
