import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JournalsService } from './journals.service';
import { JournalsController } from './journals.controller';
import { AuthMiddleware } from '../auth/auth.middleware';
import { PrismaService } from '../prisma/prisma.service';
import { UserHelper } from '../helpers/user';

@Module({
  controllers: [JournalsController],
  providers: [JournalsService, PrismaService, UserHelper],
})
export class JournalsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(JournalsController)
  }
}
