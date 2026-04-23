import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  InventoryBalance,
  Material,
  MaterialCategory,
  MaterialRequest,
  MaterialRequestItem,
  Organization,
  Permission,
  Project,
  PurchaseOrder,
  PurchaseOrderItem,
  Role,
  StockDocument,
  StockDocumentItem,
  StockLedger,
  Supplier,
  SupplierInvoice,
  SupplierInvoiceItem,
  Unit,
  User,
  Warehouse,
} from '../entities';
import { SeedService } from './seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Organization,
      Permission,
      Role,
      User,
      Unit,
      MaterialCategory,
      Material,
      Warehouse,
      Project,
      Supplier,
      MaterialRequest,
      MaterialRequestItem,
      PurchaseOrder,
      PurchaseOrderItem,
      SupplierInvoice,
      SupplierInvoiceItem,
      StockDocument,
      StockDocumentItem,
      InventoryBalance,
      StockLedger,
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class DatabaseSeedModule {}
