import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { UserHelper } from 'src/helpers/user';

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
