import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  InventoryBalance,
  Material,
  MaterialRequest,
  MaterialRequestItem,
  Project,
  PurchaseOrder,
  PurchaseOrderItem,
  StockDocument,
  StockDocumentItem,
  StockLedger,
  Supplier,
  SupplierInvoice,
  SupplierInvoiceItem,
  Warehouse,
} from '../../entities';
import { AuditModule } from '../audit/audit.module';
import { OperationsController } from './operations.controller';
import { OperationsService } from './operations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MaterialRequest,
      MaterialRequestItem,
      PurchaseOrder,
      PurchaseOrderItem,
      SupplierInvoice,
      SupplierInvoiceItem,
      StockDocument,
      StockDocumentItem,
      Material,
      Project,
      Warehouse,
      Supplier,
      InventoryBalance,
      StockLedger,
    ]),
    AuditModule,
  ],
  providers: [OperationsService],
  controllers: [OperationsController],
  exports: [OperationsService],
})
export class OperationsModule {}
