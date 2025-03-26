import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { UserHelper } from 'src/helpers/user';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthMiddleware } from 'src/auth/auth.middleware';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService, PrismaService, UserHelper],
})
export class AnalyticsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(AnalyticsController);
  }
}
