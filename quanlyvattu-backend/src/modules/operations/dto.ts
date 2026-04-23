import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { StockDocumentType } from '../../common/enums';

export class MaterialRequestItemDto {
  @IsUUID()
  materialId: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0.001)
  requestedQty: number;

  @IsOptional()
  @IsString()
  note?: string;
}

export class CreateMaterialRequestDto {
  @IsUUID()
  projectId: string;

  @IsOptional()
  @IsUUID()
  warehouseId?: string;

  @IsOptional()
  @IsString()
  neededDate?: string;

  @IsOptional()
  @IsString()
  purpose?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => MaterialRequestItemDto)
  items: MaterialRequestItemDto[];
}

export class PurchaseOrderItemDto {
  @IsUUID()
  materialId: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0.001)
  qty: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  taxRate?: number;
}

export class CreatePurchaseOrderDto {
  @IsUUID()
  supplierId: string;

  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsUUID()
  warehouseId?: string;

  @IsOptional()
  @IsString()
  orderDate?: string;

  @IsOptional()
  @IsString()
  expectedDeliveryDate?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PurchaseOrderItemDto)
  items: PurchaseOrderItemDto[];
}

export class SupplierInvoiceItemDto {
  @IsUUID()
  materialId: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0.001)
  qty: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  taxRate?: number;
}

export class CreateSupplierInvoiceDto {
  @IsString()
  invoiceNo: string;

  @IsUUID()
  supplierId: string;

  @IsOptional()
  @IsUUID()
  purchaseOrderId?: string;

  @IsOptional()
  @IsString()
  invoiceDate?: string;

  @IsOptional()
  @IsString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  attachmentUrl?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SupplierInvoiceItemDto)
  items: SupplierInvoiceItemDto[];
}

export class StockDocumentItemDto {
  @IsUUID()
  materialId: string;

  @Type(() => Number)
  @IsNumber()
  qty: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  unitCost?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  taxRate?: number;

  @IsOptional()
  @IsString()
  batchNo?: string;

  @IsOptional()
  @IsString()
  serialNo?: string;

  @IsOptional()
  @IsString()
  note?: string;
}

export class CreateStockDocumentDto {
  @IsEnum(StockDocumentType)
  type: StockDocumentType;

  @IsOptional()
  @IsString()
  referenceNo?: string;

  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsUUID()
  supplierId?: string;

  @IsOptional()
  @IsUUID()
  invoiceId?: string;

  @IsOptional()
  @IsUUID()
  requestId?: string;

  @IsOptional()
  @IsUUID()
  sourceWarehouseId?: string;

  @IsOptional()
  @IsUUID()
  destinationWarehouseId?: string;

  @IsOptional()
  @IsString()
  documentDate?: string;

  @IsOptional()
  @IsString()
  postingDate?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => StockDocumentItemDto)
  items: StockDocumentItemDto[];
}
