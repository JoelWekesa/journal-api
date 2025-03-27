import { BadRequestException, Injectable } from '@nestjs/common';
import { UserHelper } from '../helpers/user';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create.dto';
import { EditCategoryDto } from './dto/edit.dto';

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

            include: {
                _count: {
                    select: {
                        Journal: true
                    }
                }
            },

            orderBy: {
                createdAt: 'desc'
            }
        }).then(data => data).catch(err => {
            throw new BadRequestException(err);
        });

        return categories
    }

    async editCategory(data: EditCategoryDto) {
        const edit = await this.prisma.category.update({
            where: {
                id: data.id
            },

            data: {
                ...data
            }
        }).then(data => data).catch(err => {
            throw new BadRequestException(err);
        });

        return edit
    }

    async deleteCategory(data: EditCategoryDto) {
        const deleted = await this.prisma.category.delete({
            where: {
                id: data.id
            }
        }).then(data => data).catch(err => {
            throw new BadRequestException(err);
        }
        );

        return deleted
    }
}
