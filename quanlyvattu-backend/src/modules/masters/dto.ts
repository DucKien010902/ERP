import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ProjectStatus, WarehouseType } from '../../common/enums';

export class CreateUnitDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  symbol?: string;
}

export class CreateMaterialCategoryDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;
}

export class CreateMaterialDto {
  @IsString()
  code: string;

  @IsString()
  sku: string;

  @IsString()
  name: string;

  @IsUUID()
  categoryId: string;

  @IsUUID()
  unitId: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  specification?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minStock?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxStock?: number;

  @IsOptional()
  @IsBoolean()
  trackBatch?: boolean;

  @IsOptional()
  @IsBoolean()
  trackSerial?: boolean;
}

export class CreateWarehouseDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsEnum(WarehouseType)
  type: WarehouseType;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  managerName?: string;
}

export class CreateProjectDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsString()
  managerName?: string;
}

export class CreateSupplierDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  taxCode?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  contactName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  paymentTerms?: string;
}
