import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { CurrentUserPayload } from '../types/current-user.type';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions =
      this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || [];

    if (!requiredPermissions.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as CurrentUserPayload | undefined;
    if (!user) {
      return false;
    }

    const effectivePermissions = new Set<string>(user.permissions || []);
    if ((user.roleCodes || []).includes('SUPER_ADMIN')) {
      effectivePermissions.add('*');
    }

    return requiredPermissions.every(
      (permission) => effectivePermissions.has('*') || effectivePermissions.has(permission),
    );
  }
}
