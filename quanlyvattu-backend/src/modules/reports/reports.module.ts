import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryBalance, Material, Project, StockDocument, StockLedger, SupplierInvoice, Warehouse } from '../../entities';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Material, Warehouse, Project, StockDocument, SupplierInvoice, InventoryBalance, StockLedger]),
  ],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}
