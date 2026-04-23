import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditAction } from '../../common/enums';
import {
  Material,
  MaterialCategory,
  Project,
  Supplier,
  Unit,
  Warehouse,
} from '../../entities';
import { AuditService } from '../audit/audit.service';
import {
  CreateMaterialCategoryDto,
  CreateMaterialDto,
  CreateProjectDto,
  CreateSupplierDto,
  CreateUnitDto,
  CreateWarehouseDto,
} from './dto';

@Injectable()
export class MastersService {
  constructor(
    @InjectRepository(Unit)
    private readonly unitRepository: Repository<Unit>,
    @InjectRepository(MaterialCategory)
    private readonly categoryRepository: Repository<MaterialCategory>,
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    private readonly auditService: AuditService,
  ) {}

  listUnits(organizationId: string) {
    return this.unitRepository.find({ where: { organizationId }, order: { name: 'ASC' } });
  }

  async createUnit(dto: CreateUnitDto, actor: any, req?: any) {
    const unit = this.unitRepository.create({ ...dto, organizationId: actor.organizationId });
    const saved = await this.unitRepository.save(unit);
    await this.auditService.log({
      organizationId: actor.organizationId,
      userId: actor.sub,
      action: AuditAction.CREATE,
      module: 'units',
      entityId: saved.id,
      newValues: dto,
      ip: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });
    return saved;
  }

  listCategories(organizationId: string) {
    return this.categoryRepository.find({
      where: { organizationId },
      relations: { parent: true },
      order: { name: 'ASC' },
    });
  }

  async createCategory(dto: CreateMaterialCategoryDto, actor: any, req?: any) {
    const category = this.categoryRepository.create({ ...dto, organizationId: actor.organizationId });
    const saved = await this.categoryRepository.save(category);
    await this.auditService.log({
      organizationId: actor.organizationId,
      userId: actor.sub,
      action: AuditAction.CREATE,
      module: 'material-categories',
      entityId: saved.id,
      newValues: dto,
      ip: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });
    return saved;
  }

  listMaterials(organizationId: string) {
    return this.materialRepository.find({
      where: { organizationId },
      relations: { category: true, unit: true },
      order: { name: 'ASC' },
    });
  }

  async createMaterial(dto: CreateMaterialDto, actor: any, req?: any) {
    const category = await this.categoryRepository.findOne({
      where: { id: dto.categoryId, organizationId: actor.organizationId },
    });
    const unit = await this.unitRepository.findOne({ where: { id: dto.unitId, organizationId: actor.organizationId } });
    if (!category || !unit) {
      throw new BadRequestException('Invalid category or unit');
    }

    const material = this.materialRepository.create({
      ...dto,
      organizationId: actor.organizationId,
      minStock: dto.minStock ?? 0,
      maxStock: dto.maxStock ?? 0,
      trackBatch: dto.trackBatch ?? false,
      trackSerial: dto.trackSerial ?? false,
    });

    const saved = await this.materialRepository.save(material);
    await this.auditService.log({
      organizationId: actor.organizationId,
      userId: actor.sub,
      action: AuditAction.CREATE,
      module: 'materials',
      entityId: saved.id,
      newValues: dto,
      ip: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });
    return this.materialRepository.findOne({ where: { id: saved.id }, relations: { category: true, unit: true } });
  }

  listWarehouses(organizationId: string) {
    return this.warehouseRepository.find({ where: { organizationId }, order: { name: 'ASC' } });
  }

  async createWarehouse(dto: CreateWarehouseDto, actor: any, req?: any) {
    const warehouse = this.warehouseRepository.create({ ...dto, organizationId: actor.organizationId });
    const saved = await this.warehouseRepository.save(warehouse);
    await this.auditService.log({
      organizationId: actor.organizationId,
      userId: actor.sub,
      action: AuditAction.CREATE,
      module: 'warehouses',
      entityId: saved.id,
      newValues: dto,
      ip: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });
    return saved;
  }

  listProjects(organizationId: string) {
    return this.projectRepository.find({ where: { organizationId }, order: { name: 'ASC' } });
  }

  async createProject(dto: CreateProjectDto, actor: any, req?: any) {
    const project = this.projectRepository.create({
      ...dto,
      organizationId: actor.organizationId,
      status: dto.status,
    });
    const saved = await this.projectRepository.save(project);
    await this.auditService.log({
      organizationId: actor.organizationId,
      userId: actor.sub,
      action: AuditAction.CREATE,
      module: 'projects',
      entityId: saved.id,
      newValues: dto,
      ip: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });
    return saved;
  }

  listSuppliers(organizationId: string) {
    return this.supplierRepository.find({ where: { organizationId }, order: { name: 'ASC' } });
  }

  async createSupplier(dto: CreateSupplierDto, actor: any, req?: any) {
    const supplier = this.supplierRepository.create({ ...dto, organizationId: actor.organizationId });
    const saved = await this.supplierRepository.save(supplier);
    await this.auditService.log({
      organizationId: actor.organizationId,
      userId: actor.sub,
      action: AuditAction.CREATE,
      module: 'suppliers',
      entityId: saved.id,
      newValues: dto,
      ip: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });
    return saved;
  }
}
