import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { JournalsModule } from './journals/journals.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, CategoryModule, JournalsModule, AnalyticsModule, SettingsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule { }
