import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { AuthMiddleware } from '../auth/auth.middleware';
import { UserHelper } from '../helpers/user';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, PrismaService, AuthService, UserHelper],
})
export class CategoryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(CategoryController)
  }
}
