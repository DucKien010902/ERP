import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { CreateUserDto } from './dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Permissions('users.read')
  list(@Req() req: any) {
    return this.usersService.list(req.user.organizationId);
  }

  @Post()
  @Permissions('users.write')
  create(@Body() dto: CreateUserDto, @Req() req: any) {
    return this.usersService.create(dto, req.user, req);
  }

  @Patch(':id/toggle-active')
  @Permissions('users.write')
  toggleActive(@Param('id') id: string, @Req() req: any) {
    return this.usersService.toggleActive(id, req.user, req);
  }
}
