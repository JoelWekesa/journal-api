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

    try {
      const valid = jwt.verify(token, process.env.JWT_SECRET) as { id: string };

      const { id } = valid;


      await this.userHelper.setUser(id);

      next();


    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }


  }
}
