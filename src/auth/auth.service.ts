import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpsertUserDto } from './dto/upsert-user.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) { }

    async upsertUser(data: UpsertUserDto) {
        const { email, name, password } = data;


        if (password) {
            const user = await this.prisma.user.findUnique({
                where: { email }
            })

            if (user && !bcrypt.compareSync(password, user.password)) {
                throw new BadRequestException('Invalid email or password')
            }
        }

        const rest = {
            name,
            password: password ? bcrypt.hashSync(password, 10) : undefined,
        }

        const user = await this.prisma.user.upsert({
            where: { email },
            update: rest,
            create: { email, ...rest },
        }).then(async data => {
            const token = jwt.sign({ id: data.id }, process.env.JWT_SECRET, { expiresIn: '1d' })
            return {
                ...data, token
            }
        }).catch(err => {
            throw new BadRequestException(err)
        })

        return user
    }
}
