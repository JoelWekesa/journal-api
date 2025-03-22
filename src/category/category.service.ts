import { BadRequestException, Injectable } from '@nestjs/common';
import { UserHelper } from 'src/helpers/user';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create.dto';

@Injectable()
export class CategoryService {
    constructor(private readonly prisma: PrismaService, private readonly userHelper: UserHelper) { }

    async create(data: CreateCategoryDto) {
        const userId = this.userHelper.getUser();

        const category = await this.prisma.category.create({
            data: {
                ...data,
                userId
            }
        }).then(data => data).catch(err => {
            throw new BadRequestException(err);
        }
        );

        return category;
    }


    async getUserCategories() {
        const userId = this.userHelper.getUser();

        const categories = await this.prisma.category.findMany({
            where: {
                userId
            },

            orderBy: {
                createdAt: 'desc'
            }
        }).then(data => data).catch(err => {
            throw new BadRequestException(err);
        });

        return categories
    }
}
