import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { JournalsModule } from './journals/journals.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, CategoryModule, JournalsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule { }
