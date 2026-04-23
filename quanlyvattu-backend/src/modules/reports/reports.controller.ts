import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { ReportsService } from './reports.service';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  @Permissions('reports.read')
  dashboard(@Req() req: any) {
    return this.reportsService.dashboard(req.user.organizationId);
  }

  @Get('project-consumption')
  @Permissions('reports.read')
  projectConsumption(@Req() req: any) {
    return this.reportsService.projectConsumption(req.user.organizationId);
  }

  @Get('movement-summary')
  @Permissions('reports.read')
  movementSummary(@Req() req: any) {
    return this.reportsService.movementSummary(req.user.organizationId);
  }
}
