import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';
import { UserHelper } from 'src/helpers/user';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService, private reflector: Reflector, private readonly userHelper: UserHelper) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const userId = this.userHelper.getUser();
    const request = context.switchToHttp().getRequest<Request>();
    const resourceId = request.method === 'PATCH' ? request.body.id : request.query.id;
    const model = this.reflector.get<string>('model', context.getHandler());

    if (!model) {
      throw new ForbiddenException('Model metadata is missing.');
    }

    if (!userId || !resourceId) {
      throw new ForbiddenException('User ID or resource ID is missing.');
    }

    const record = await this.prisma[model].findUnique({
      where: { id: resourceId },
      select: { userId: true },
    });

    if (!record) {
      throw new ForbiddenException('Resource not found.');
    }

    if (record.userId !== userId) {
      throw new ForbiddenException('You do not own this resource.');
    }

    return true;
  }
}
