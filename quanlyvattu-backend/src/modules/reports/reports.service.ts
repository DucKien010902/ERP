import { Injectable } from '@nestjs/common';
import { ProjectStatus } from '../../common/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  InventoryBalance,
  Material,
  Project,
  StockDocument,
  StockLedger,
  SupplierInvoice,
  Warehouse,
} from '../../entities';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(StockDocument)
    private readonly stockDocumentRepository: Repository<StockDocument>,
    @InjectRepository(SupplierInvoice)
    private readonly invoiceRepository: Repository<SupplierInvoice>,
    @InjectRepository(InventoryBalance)
    private readonly balanceRepository: Repository<InventoryBalance>,
    @InjectRepository(StockLedger)
    private readonly ledgerRepository: Repository<StockLedger>,
  ) {}

  async dashboard(organizationId: string) {
    const [materials, warehouses, activeProjects, documents, invoices, balances] = await Promise.all([
      this.materialRepository.count({ where: { organizationId } }),
      this.warehouseRepository.count({ where: { organizationId } }),
      this.projectRepository.count({ where: { organizationId, status: ProjectStatus.ACTIVE } }),
      this.stockDocumentRepository.count({ where: { organizationId } }),
      this.invoiceRepository.count({ where: { organizationId } }),
      this.balanceRepository.find({ where: { organizationId }, relations: { material: true } }),
    ]);

    const stockValue = balances.reduce(
      (sum, balance) => sum + Number(balance.onHandQty || 0) * Number(balance.averageCost || 0),
      0,
    );
    const lowStock = balances.filter((balance) => Number(balance.onHandQty) <= Number(balance.material?.minStock || 0));

    return {
      materials,
      warehouses,
      activeProjects,
      stockDocuments: documents,
      invoices,
      stockValue: Number(stockValue.toFixed(2)),
      lowStockCount: lowStock.length,
      lowStockItems: lowStock.slice(0, 10).map((item) => ({
        material: item.material?.name,
        warehouseId: item.warehouseId,
        onHandQty: item.onHandQty,
        minStock: item.material?.minStock,
      })),
    };
  }

  async projectConsumption(organizationId: string) {
    const rows = await this.ledgerRepository
      .createQueryBuilder('ledger')
      .leftJoinAndSelect('ledger.material', 'material')
      .leftJoinAndSelect('ledger.project', 'project')
      .where('ledger.organization_id = :organizationId', { organizationId })
      .andWhere('ledger.project_id IS NOT NULL')
      .andWhere('ledger.qty_out > 0')
      .select('project.id', 'projectId')
      .addSelect('project.name', 'projectName')
      .addSelect('material.id', 'materialId')
      .addSelect('material.name', 'materialName')
      .addSelect('SUM(ledger.qty_out)', 'consumedQty')
      .addSelect('SUM(ledger.total_cost)', 'consumedValue')
      .groupBy('project.id')
      .addGroupBy('material.id')
      .orderBy('project.name', 'ASC')
      .getRawMany();

    return rows;
  }

  async movementSummary(organizationId: string) {
    const rows = await this.ledgerRepository
      .createQueryBuilder('ledger')
      .where('ledger.organization_id = :organizationId', { organizationId })
      .select('ledger.movementType', 'movementType')
      .addSelect('SUM(ledger.qty_in)', 'totalIn')
      .addSelect('SUM(ledger.qty_out)', 'totalOut')
      .addSelect('SUM(ledger.total_cost)', 'totalValue')
      .groupBy('ledger.movementType')
      .orderBy('ledger.movementType', 'ASC')
      .getRawMany();

    return rows;
  }
}
