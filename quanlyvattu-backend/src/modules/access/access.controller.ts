import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { AccessService } from './access.service';

@ApiTags('Access')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('access')
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  @Get('roles')
  @Permissions('roles.read')
  listRoles() {
    return this.accessService.listRoles();
  }

  @Get('permissions')
  @Permissions('roles.read')
  listPermissions() {
    return this.accessService.listPermissions();
  }
}
