import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context).getContext();

    if (!ctx.req.headers.authorization) {
      return false;
    }

    ctx.user = this.validateToken(ctx.req.headers.authorization);
    return true;
  }

  validateToken(auth: string) {
    console.log(auth);
    if (auth.split(' ')[0] !== 'Bearer') {
      throw new ApolloError(
        'Invalid token',
        HttpStatus.UNAUTHORIZED.toString(),
      );
    }
    const token = auth.split(' ')[1];

    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new ApolloError(
        'Invalid token',
        HttpStatus.UNAUTHORIZED.toString(),
      );
    }
  }
}
