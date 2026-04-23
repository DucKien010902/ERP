import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import {
  CreateMaterialCategoryDto,
  CreateMaterialDto,
  CreateProjectDto,
  CreateSupplierDto,
  CreateUnitDto,
  CreateWarehouseDto,
} from './dto';
import { MastersService } from './masters.service';

@ApiTags('Master Data')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('masters')
export class MastersController {
  constructor(private readonly mastersService: MastersService) {}

  @Get('units')
  @Permissions('masters.read')
  listUnits(@Req() req: any) {
    return this.mastersService.listUnits(req.user.organizationId);
  }

  @Post('units')
  @Permissions('masters.write')
  createUnit(@Body() dto: CreateUnitDto, @Req() req: any) {
    return this.mastersService.createUnit(dto, req.user, req);
  }

  @Get('categories')
  @Permissions('masters.read')
  listCategories(@Req() req: any) {
    return this.mastersService.listCategories(req.user.organizationId);
  }

  @Post('categories')
  @Permissions('masters.write')
  createCategory(@Body() dto: CreateMaterialCategoryDto, @Req() req: any) {
    return this.mastersService.createCategory(dto, req.user, req);
  }

  @Get('materials')
  @Permissions('masters.read')
  listMaterials(@Req() req: any) {
    return this.mastersService.listMaterials(req.user.organizationId);
  }

  @Post('materials')
  @Permissions('masters.write')
  createMaterial(@Body() dto: CreateMaterialDto, @Req() req: any) {
    return this.mastersService.createMaterial(dto, req.user, req);
  }

  @Get('warehouses')
  @Permissions('masters.read')
  listWarehouses(@Req() req: any) {
    return this.mastersService.listWarehouses(req.user.organizationId);
  }

  @Post('warehouses')
  @Permissions('masters.write')
  createWarehouse(@Body() dto: CreateWarehouseDto, @Req() req: any) {
    return this.mastersService.createWarehouse(dto, req.user, req);
  }

  @Get('projects')
  @Permissions('masters.read')
  listProjects(@Req() req: any) {
    return this.mastersService.listProjects(req.user.organizationId);
  }

  @Post('projects')
  @Permissions('masters.write')
  createProject(@Body() dto: CreateProjectDto, @Req() req: any) {
    return this.mastersService.createProject(dto, req.user, req);
  }

  @Get('suppliers')
  @Permissions('masters.read')
  listSuppliers(@Req() req: any) {
    return this.mastersService.listSuppliers(req.user.organizationId);
  }

  @Post('suppliers')
  @Permissions('masters.write')
  createSupplier(@Body() dto: CreateSupplierDto, @Req() req: any) {
    return this.mastersService.createSupplier(dto, req.user, req);
  }
}
