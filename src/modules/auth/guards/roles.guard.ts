import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../shared/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRole = this.reflector.get(ROLES_KEY, context.getHandler());

    if (!requiredRole || !requiredRole?.length) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (Array.isArray(requiredRole)) {
      return requiredRole.some((role) => role === user?.accessLevel);
    }

    return requiredRole === user?.accessLevel;
  }
}