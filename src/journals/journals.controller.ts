import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JournalsService } from './journals.service';
import { CreateJournalDto } from './dto/create.dto';
import { EditJournalDto } from './dto/edit.dto';
import { OwnershipGuard } from 'src/ownership/ownership.guard';
import { SetOwnershipModel } from 'src/ownership/ownership.decorator';

@Controller('journals')
export class JournalsController {
  constructor(private readonly journalsService: JournalsService) { }

  @Get()
  async getUserJournals() {
    return this.journalsService.getUserJournals();
  }

  @Post()
  async create(@Body() data: CreateJournalDto) {
    return this.journalsService.create(data);
  }

  @UseGuards(OwnershipGuard)
  @SetOwnershipModel({ model: 'Journal' })
  @Patch()
  async updateJournal(@Body() data: EditJournalDto) {
    return this.journalsService.updateJournal(data);
  }

  @UseGuards(OwnershipGuard)
  @SetOwnershipModel({ model: 'Journal' })
  @Delete()
  async delete(@Query() data: EditJournalDto) {
    return this.journalsService.deleteJournal(data);
  }

}
