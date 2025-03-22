import { ForbiddenException, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserHelper } from 'src/helpers/user';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor(private readonly userHelper: UserHelper) { }

  async use(req: Request, res: Response, next: NextFunction) {

    const header = req?.headers?.authorization;
    if (!header) {
      throw new ForbiddenException('No authorization header');
    }

    const token = header.split(' ')[1];

    const valid = await jwt.verifyAsync(token).then(data => data).catch((err) => {
      console.error(err); //TODO implement logger
      return null;
    });

    if (!valid) {
      throw new UnauthorizedException('Invalid token');
    }

    const { id } = valid;

    await this.userHelper.setUser(id);

    next();
  }
}
