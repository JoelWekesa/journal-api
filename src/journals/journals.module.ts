import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JournalsService } from './journals.service';
import { JournalsController } from './journals.controller';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserHelper } from 'src/helpers/user';

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
