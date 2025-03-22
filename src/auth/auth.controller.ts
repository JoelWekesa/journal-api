import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpsertUserDto } from './dto/upsert-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post()
  async signup(@Body() data: UpsertUserDto) {
    return this.authService.upsertUser(data);
  }
}
