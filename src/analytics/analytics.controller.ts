import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { YearFreqDto } from './dto/year-freq';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) { }

  @Get('average-word-count')
  async averageWordLength() {
    return this.analyticsService.averageWordLength();
  }

  @Get('longest-streak')
  async longestStreak() {
    return this.analyticsService.longestStreak();
  }

  @Get('total-journals')
  async totalJournals() {
    return this.analyticsService.totalJournals();
  }

  @Get('category-distribution')
  async categoryDistribution() {
    return this.analyticsService.categoryDistribution();
  }

  @Get('word-count-trend')
  async weeklyWordCountTrends() {
    return this.analyticsService.wordCountTrends();
  }


  @Get('yearly-frequency')
  async yearlyJournalFrequency(@Query() year: YearFreqDto) {
    return this.analyticsService.yearlyJournalFrequency(year);
  }

  @Get('average-word-count-by-category')
  async averageWordCountByCategory() {
    return this.analyticsService.averageWordCountByCategory();
  }

  @Get('time-of-day-stats')
  async timeOfDayStats() {
    return this.analyticsService.timeOfDayStats();
  }


}
