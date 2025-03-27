import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { UserHelper } from '../helpers/user';
import { PrismaService } from '../prisma/prisma.service';
import { AuthMiddleware } from '../auth/auth.middleware';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService, PrismaService, UserHelper],
})
export class AnalyticsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(AnalyticsController);
  }
}
