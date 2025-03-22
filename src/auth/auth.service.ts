import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpsertUserDto } from './dto/upsert-user.dto';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) { }

    async upsertUser(data: UpsertUserDto) {
        const { email, name, password } = data;

        const rest = {
            name,
            password: password ? bcrypt.hashSync(password, 10) : undefined,
        }

        const user = await this.prisma.user.upsert({
            where: { email },
            update: rest,
            create: { email, ...rest },
        }).then(data => data).catch(err => {
            throw new BadRequestException(err)
        })

        return user
    }
}
