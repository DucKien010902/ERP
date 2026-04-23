import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  AuditAction,
  DocumentStatus,
  InvoiceStatus,
  MaterialRequestStatus,
  MovementDirection,
  PurchaseOrderStatus,
  StockDocumentType,
} from '../../common/enums';
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
import { AuditService } from '../audit/audit.service';
import {
  CreateMaterialRequestDto,
  CreatePurchaseOrderDto,
  CreateStockDocumentDto,
  CreateSupplierInvoiceDto,
} from './dto';

@Injectable()
export class OperationsService {
  constructor(
    @InjectRepository(MaterialRequest)
    private readonly materialRequestRepository: Repository<MaterialRequest>,
    @InjectRepository(MaterialRequestItem)
    private readonly materialRequestItemRepository: Repository<MaterialRequestItem>,
    @InjectRepository(PurchaseOrder)
    private readonly purchaseOrderRepository: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseOrderItem)
    private readonly purchaseOrderItemRepository: Repository<PurchaseOrderItem>,
    @InjectRepository(SupplierInvoice)
    private readonly supplierInvoiceRepository: Repository<SupplierInvoice>,
    @InjectRepository(SupplierInvoiceItem)
    private readonly supplierInvoiceItemRepository: Repository<SupplierInvoiceItem>,
    @InjectRepository(StockDocument)
    private readonly stockDocumentRepository: Repository<StockDocument>,
    @InjectRepository(StockDocumentItem)
    private readonly stockDocumentItemRepository: Repository<StockDocumentItem>,
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    @InjectRepository(InventoryBalance)
    private readonly inventoryBalanceRepository: Repository<InventoryBalance>,
    @InjectRepository(StockLedger)
    private readonly stockLedgerRepository: Repository<StockLedger>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly auditService: AuditService,
  ) {}

  private buildCode(prefix: string) {
    const now = new Date();
    const yyyymmdd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
      now.getDate(),
    ).padStart(2, '0')}`;
    const rand = Math.floor(Math.random() * 9000) + 1000;
    return `${prefix}-${yyyymmdd}-${rand}`;
  }

  private calculateTotals(items: Array<{ qty: number; unitPrice?: number; unitCost?: number; taxRate?: number }>) {
    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.qty) * Number(item.unitPrice ?? item.unitCost ?? 0),
      0,
    );
    const taxTotal = items.reduce(
      (sum, item) =>
        sum +
        Number(item.qty) * Number(item.unitPrice ?? item.unitCost ?? 0) * (Number(item.taxRate ?? 0) / 100),
      0,
    );
    const grandTotal = subtotal + taxTotal;
    return {
      subtotal: Number(subtotal.toFixed(2)),
      taxTotal: Number(taxTotal.toFixed(2)),
      grandTotal: Number(grandTotal.toFixed(2)),
    };
  }

  private async validateMaterials(organizationId: string, materialIds: string[]) {
    const materials = await this.materialRepository.find({
      where: materialIds.map((id) => ({ id, organizationId })),
    });
    if (materials.length !== new Set(materialIds).size) {
      throw new BadRequestException('One or more materials are invalid for this organization');
    }
    return materials;
  }

  async listMaterialRequests(organizationId: string) {
    return this.materialRequestRepository.find({
      where: { organizationId },
      relations: { project: true, warehouse: true, requester: true, approver: true, items: { material: true } },
      order: { createdAt: 'DESC' },
    });
  }

  async getMaterialRequest(id: string, organizationId: string) {
    const request = await this.materialRequestRepository.findOne({
      where: { id, organizationId },
      relations: { project: true, warehouse: true, requester: true, approver: true, items: { material: true } },
    });
    if (!request) {
      throw new NotFoundException('Material request not found');
    }
    return request;
  }

  async createMaterialRequest(dto: CreateMaterialRequestDto, actor: any, req?: any) {
    const project = await this.projectRepository.findOne({ where: { id: dto.projectId, organizationId: actor.organizationId } });
    if (!project) {
      throw new BadRequestException('Invalid project');
    }
    if (dto.warehouseId) {
      const warehouse = await this.warehouseRepository.findOne({
        where: { id: dto.warehouseId, organizationId: actor.organizationId },
      });
      if (!warehouse) {
        throw new BadRequestException('Invalid warehouse');
      }
    }
    await this.validateMaterials(
      actor.organizationId,
      dto.items.map((item) => item.materialId),
    );

    const entity = this.materialRequestRepository.create({
      organizationId: actor.organizationId,
      requestNo: this.buildCode('MR'),
      projectId: dto.projectId,
      warehouseId: dto.warehouseId,
      requesterId: actor.sub,
      neededDate: dto.neededDate,
      purpose: dto.purpose,
      status: MaterialRequestStatus.DRAFT,
      items: dto.items.map((item) =>
        this.materialRequestItemRepository.create({
          materialId: item.materialId,
          requestedQty: item.requestedQty,
          approvedQty: 0,
          issuedQty: 0,
          note: item.note,
        }),
      ),
    });

    const saved = await this.materialRequestRepository.save(entity);
    await this.auditService.log({
      organizationId: actor.organizationId,
      userId: actor.sub,
      action: AuditAction.CREATE,
      module: 'material-requests',
      entityId: saved.id,
      newValues: { requestNo: saved.requestNo, projectId: saved.projectId },
      ip: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });
    return this.getMaterialRequest(saved.id, actor.organizationId);
  }

  async submitMaterialRequest(id: string, actor: any, req?: any) {
    const request = await this.getMaterialRequest(id, actor.organizationId);
    if (request.status !== MaterialRequestStatus.DRAFT) {
      throw new BadRequestException('Only draft request can be submitted');
    }
    request.status = MaterialRequestStatus.SUBMITTED;
    const saved = await this.materialRequestRepository.save(request);
    await this.auditService.log({
      organizationId: actor.organizationId,
      userId: actor.sub,
      action: AuditAction.SUBMIT,
      module: 'material-requests',
      entityId: saved.id,
      newValues: { status: saved.status },
      ip: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });
    return saved;
  }

  async approveMaterialRequest(id: string, actor: any, req?: any) {
    const request = await this.getMaterialRequest(id, actor.organizationId);
    if (![MaterialRequestStatus.SUBMITTED, MaterialRequestStatus.PARTIAL].includes(request.status)) {
      throw new BadRequestException('Request is not in approvable state');
    }
    request.status = MaterialRequestStatus.APPROVED;
    request.approverId = actor.sub;
    request.items.forEach((item) => {
      item.approvedQty = item.approvedQty && Number(item.approvedQty) > 0 ? item.approvedQty : item.requestedQty;
    });
    const saved = await this.materialRequestRepository.save(request);
    await this.auditService.log({
      organizationId: actor.organizationId,
      userId: actor.sub,
      action: AuditAction.APPROVE,
      module: 'material-requests',
      entityId: saved.id,
      newValues: { status: saved.status, approverId: actor.sub },
      ip: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });
    return this.getMaterialRequest(saved.id, actor.organizationId);
  }

  async listPurchaseOrders(organizationId: string) {
    return this.purchaseOrderRepository.find({
      where: { organizationId },
      relations: { supplier: true, project: true, warehouse: true, createdBy: true, approvedBy: true, items: { material: true } },
      order: { createdAt: 'DESC' },
    });
  }

  async getPurchaseOrder(id: string, organizationId: string) {
    const po = await this.purchaseOrderRepository.findOne({
      where: { id, organizationId },
      relations: { supplier: true, project: true, warehouse: true, createdBy: true, approvedBy: true, items: { material: true } },
    });
    if (!po) {
      throw new NotFoundException('Purchase order not found');
    }
    return po;
  }

  async createPurchaseOrder(dto: CreatePurchaseOrderDto, actor: any, req?: any) {
    const supplier = await this.supplierRepository.findOne({
      where: { id: dto.supplierId, organizationId: actor.organizationId },
    });
    if (!supplier) {
      throw new BadRequestException('Invalid supplier');
    }
    if (dto.projectId) {
      const project = await this.projectRepository.findOne({ where: { id: dto.projectId, organizationId: actor.organizationId } });
      if (!project) {
        throw new BadRequestException('Invalid project');
      }
    }
    if (dto.warehouseId) {
      const warehouse = await this.warehouseRepository.findOne({
        where: { id: dto.warehouseId, organizationId: actor.organizationId },
      });
      if (!warehouse) {
        throw new BadRequestException('Invalid warehouse');
      }
    }
    await this.validateMaterials(
      actor.organizationId,
      dto.items.map((item) => item.materialId),
    );
    const totals = this.calculateTotals(dto.items);

    const entity = this.purchaseOrderRepository.create({
      organizationId: actor.organizationId,
      poNo: this.buildCode('PO'),
      supplierId: dto.supplierId,
      projectId: dto.projectId,
      warehouseId: dto.warehouseId,
      createdById: actor.sub,
      orderDate: dto.orderDate,
      expectedDeliveryDate: dto.expectedDeliveryDate,
      status: PurchaseOrderStatus.DRAFT,
      note: dto.note,
      ...totals,
      items: dto.items.map((item) =>
        this.purchaseOrderItemRepository.create({
          materialId: item.materialId,
          qty: item.qty,
          unitPrice: item.unitPrice,
          taxRate: item.taxRate ?? 0,
          lineTotal: Number((item.qty * item.unitPrice).toFixed(2)),
          receivedQty: 0,
        }),
      ),
    });

    const saved = await this.purchaseOrderRepository.save(entity);
    await this.auditService.log({
      organizationId: actor.organizationId,
      userId: actor.sub,
      action: AuditAction.CREATE,
      module: 'purchase-orders',
      entityId: saved.id,
      newValues: { poNo: saved.poNo, supplierId: saved.supplierId, grandTotal: saved.grandTotal },
      ip: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });
    return this.getPurchaseOrder(saved.id, actor.organizationId);
  }

  async approvePurchaseOrder(id: string, actor: any, req?: any) {
    const po = await this.getPurchaseOrder(id, actor.organizationId);
    if (![PurchaseOrderStatus.DRAFT, PurchaseOrderStatus.SUBMITTED].includes(po.status)) {
      throw new BadRequestException('Purchase order is not in approvable state');
    }
    po.status = PurchaseOrderStatus.APPROVED;
    po.approvedById = actor.sub;
    const saved = await this.purchaseOrderRepository.save(po);
    await this.auditService.log({
      organizationId: actor.organizationId,
      userId: actor.sub,
      action: AuditAction.APPROVE,
      module: 'purchase-orders',
      entityId: saved.id,
      newValues: { status: saved.status, approvedById: actor.sub },
      ip: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });
    return this.getPurchaseOrder(saved.id, actor.organizationId);
  }

  async listSupplierInvoices(organizationId: string) {
    return this.supplierInvoiceRepository.find({
      where: { organizationId },
      relations: { supplier: true, purchaseOrder: true, createdBy: true, approvedBy: true, items: { material: true } },
      order: { createdAt: 'DESC' },
    });
  }

  async getSupplierInvoice(id: string, organizationId: string) {
    const invoice = await this.supplierInvoiceRepository.findOne({
      where: { id, organizationId },
      relations: { supplier: true, purchaseOrder: true, createdBy: true, approvedBy: true, items: { material: true } },
    });
    if (!invoice) {
      throw new NotFoundException('Supplier invoice not found');
    }
    return invoice;
  }

  async createSupplierInvoice(dto: CreateSupplierInvoiceDto, actor: any, req?: any) {
    const supplier = await this.supplierRepository.findOne({
      where: { id: dto.supplierId, organizationId: actor.organizationId },
    });
    if (!supplier) {
      throw new BadRequestException('Invalid supplier');
    }
    if (dto.purchaseOrderId) {
      const po = await this.purchaseOrderRepository.findOne({
        where: { id: dto.purchaseOrderId, organizationId: actor.organizationId },
      });
      if (!po) {
        throw new BadRequestException('Invalid purchase order');
      }
    }
    await this.validateMaterials(
      actor.organizationId,
      dto.items.map((item) => item.materialId),
    );
    const totals = this.calculateTotals(dto.items);

    const entity = this.supplierInvoiceRepository.create({
      organizationId: actor.organizationId,
      invoiceNo: dto.invoiceNo,
      supplierId: dto.supplierId,
      purchaseOrderId: dto.purchaseOrderId,
      createdById: actor.sub,
      invoiceDate: dto.invoiceDate,
      dueDate: dto.dueDate,
      attachmentUrl: dto.attachmentUrl,
      note: dto.note,
      status: InvoiceStatus.DRAFT,
      ...totals,
      items: dto.items.map((item) =>
        this.supplierInvoiceItemRepository.create({
          materialId: item.materialId,
          qty: item.qty,
          unitPrice: item.unitPrice,
          taxRate: item.taxRate ?? 0,
          lineTotal: Number((item.qty * item.unitPrice).toFixed(2)),
        }),
      ),
    });

    const saved = await this.supplierInvoiceRepository.save(entity);
    await this.auditService.log({
      organizationId: actor.organizationId,
      userId: actor.sub,
      action: AuditAction.CREATE,
      module: 'supplier-invoices',
      entityId: saved.id,
      newValues: { invoiceNo: saved.invoiceNo, supplierId: saved.supplierId, grandTotal: saved.grandTotal },
      ip: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });
    return this.getSupplierInvoice(saved.id, actor.organizationId);
  }

  async approveSupplierInvoice(id: string, actor: any, req?: any) {
    const invoice = await this.getSupplierInvoice(id, actor.organizationId);
    if (![InvoiceStatus.DRAFT, InvoiceStatus.SUBMITTED].includes(invoice.status)) {
      throw new BadRequestException('Supplier invoice is not in approvable state');
    }
    invoice.status = InvoiceStatus.APPROVED;
    invoice.approvedById = actor.sub;
    const saved = await this.supplierInvoiceRepository.save(invoice);
    await this.auditService.log({
      organizationId: actor.organizationId,
      userId: actor.sub,
      action: AuditAction.APPROVE,
      module: 'supplier-invoices',
      entityId: saved.id,
      newValues: { status: saved.status, approvedById: actor.sub },
      ip: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });
    return this.getSupplierInvoice(saved.id, actor.organizationId);
  }

  async listStockDocuments(organizationId: string) {
    return this.stockDocumentRepository.find({
      where: { organizationId },
      relations: {
        project: true,
        supplier: true,
        invoice: true,
        request: true,
        sourceWarehouse: true,
        destinationWarehouse: true,
        createdBy: true,
        approvedBy: true,
        postedBy: true,
        items: { material: true },
      },
      order: { createdAt: 'DESC' },
    });
  }

  async getStockDocument(id: string, organizationId: string) {
    const document = await this.stockDocumentRepository.findOne({
      where: { id, organizationId },
      relations: {
        project: true,
        supplier: true,
        invoice: true,
        request: true,
        sourceWarehouse: true,
        destinationWarehouse: true,
        createdBy: true,
        approvedBy: true,
        postedBy: true,
        items: { material: true },
      },
    });
    if (!document) {
      throw new NotFoundException('Stock document not found');
    }
    return document;
  }

  async createStockDocument(dto: CreateStockDocumentDto, actor: any, req?: any) {
    await this.validateMaterials(
      actor.organizationId,
      dto.items.map((item) => item.materialId),
    );

    if (dto.projectId) {
      const project = await this.projectRepository.findOne({ where: { id: dto.projectId, organizationId: actor.organizationId } });
      if (!project) {
        throw new BadRequestException('Invalid project');
      }
    }
    if (dto.supplierId) {
      const supplier = await this.supplierRepository.findOne({ where: { id: dto.supplierId, organizationId: actor.organizationId } });
      if (!supplier) {
        throw new BadRequestException('Invalid supplier');
      }
    }
    if (dto.sourceWarehouseId) {
      const warehouse = await this.warehouseRepository.findOne({
        where: { id: dto.sourceWarehouseId, organizationId: actor.organizationId },
      });
      if (!warehouse) {
        throw new BadRequestException('Invalid source warehouse');
      }
    }
    if (dto.destinationWarehouseId) {
      const warehouse = await this.warehouseRepository.findOne({
        where: { id: dto.destinationWarehouseId, organizationId: actor.organizationId },
      });
      if (!warehouse) {
        throw new BadRequestException('Invalid destination warehouse');
      }
    }

    const requiresSource = [
      StockDocumentType.ISSUE,
      StockDocumentType.TRANSFER,
      StockDocumentType.RETURN_TO_SUPPLIER,
      StockDocumentType.ADJUSTMENT,
    ].includes(dto.type);
    const requiresDestination = [
      StockDocumentType.RECEIPT,
      StockDocumentType.TRANSFER,
      StockDocumentType.RETURN_FROM_SITE,
    ].includes(dto.type);

    if (requiresSource && !dto.sourceWarehouseId && dto.type !== StockDocumentType.ADJUSTMENT) {
      throw new BadRequestException('Source warehouse is required for this document type');
    }
    if (requiresDestination && !dto.destinationWarehouseId) {
      throw new BadRequestException('Destination warehouse is required for this document type');
    }

    const totals = this.calculateTotals(dto.items);
    const document = this.stockDocumentRepository.create({
      organizationId: actor.organizationId,
      documentNo: this.buildCode('STK'),
      type: dto.type,
      status: DocumentStatus.DRAFT,
      referenceNo: dto.referenceNo,
      projectId: dto.projectId,
      supplierId: dto.supplierId,
      invoiceId: dto.invoiceId,
      requestId: dto.requestId,
      sourceWarehouseId: dto.sourceWarehouseId,
      destinationWarehouseId: dto.destinationWarehouseId,
      createdById: actor.sub,
      documentDate: dto.documentDate,
      postingDate: dto.postingDate,
      note: dto.note,
      ...totals,
      items: dto.items.map((item) =>
        this.stockDocumentItemRepository.create({
          materialId: item.materialId,
          qty: item.qty,
          unitCost: item.unitCost ?? 0,
          taxRate: item.taxRate ?? 0,
          lineTotal: Number((item.qty * (item.unitCost ?? 0)).toFixed(2)),
          batchNo: item.batchNo,
          serialNo: item.serialNo,
          note: item.note,
        }),
      ),
    });

    const saved = await this.stockDocumentRepository.save(document);
    await this.auditService.log({
      organizationId: actor.organizationId,
      userId: actor.sub,
      action: AuditAction.CREATE,
      module: 'stock-documents',
      entityId: saved.id,
      newValues: { documentNo: saved.documentNo, type: saved.type },
      ip: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });
    return this.getStockDocument(saved.id, actor.organizationId);
  }

  async submitStockDocument(id: string, actor: any, req?: any) {
    const document = await this.getStockDocument(id, actor.organizationId);
    if (document.status !== DocumentStatus.DRAFT) {
      throw new BadRequestException('Only draft document can be submitted');
    }
    document.status = DocumentStatus.PENDING_APPROVAL;
    const saved = await this.stockDocumentRepository.save(document);
    await this.auditService.log({
      organizationId: actor.organizationId,
      userId: actor.sub,
      action: AuditAction.SUBMIT,
      module: 'stock-documents',
      entityId: saved.id,
      newValues: { status: saved.status },
      ip: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });
    return saved;
  }

  async approveStockDocument(id: string, actor: any, req?: any) {
    const document = await this.getStockDocument(id, actor.organizationId);
    if (![DocumentStatus.DRAFT, DocumentStatus.PENDING_APPROVAL].includes(document.status)) {
      throw new BadRequestException('Document is not in approvable state');
    }
    document.status = DocumentStatus.APPROVED;
    document.approvedById = actor.sub;
    const saved = await this.stockDocumentRepository.save(document);
    await this.auditService.log({
      organizationId: actor.organizationId,
      userId: actor.sub,
      action: AuditAction.APPROVE,
      module: 'stock-documents',
      entityId: saved.id,
      newValues: { status: saved.status, approvedById: actor.sub },
      ip: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });
    return this.getStockDocument(saved.id, actor.organizationId);
  }

  private async upsertInventoryBalance(
    manager: any,
    params: {
      organizationId: string;
      materialId: string;
      warehouseId: string;
      qtyDelta: number;
      unitCost: number;
      movementDate: Date;
    },
  ) {
    const balanceRepo = manager.getRepository(InventoryBalance) as Repository<InventoryBalance>;
    let balance = await balanceRepo.findOne({
      where: {
        organizationId: params.organizationId,
        materialId: params.materialId,
        warehouseId: params.warehouseId,
      },
    });

    if (!balance) {
      balance = balanceRepo.create({
        organizationId: params.organizationId,
        materialId: params.materialId,
        warehouseId: params.warehouseId,
        onHandQty: 0,
        reservedQty: 0,
        availableQty: 0,
        averageCost: 0,
      });
    }

    const currentQty = Number(balance.onHandQty || 0);
    const currentAvg = Number(balance.averageCost || 0);
    const delta = Number(params.qtyDelta);
    const nextQty = Number((currentQty + delta).toFixed(3));

    if (nextQty < 0) {
      throw new BadRequestException(`Insufficient stock for material ${params.materialId} at warehouse ${params.warehouseId}`);
    }

    let nextAvg = currentAvg;
    if (delta > 0) {
      if (currentQty <= 0) {
        nextAvg = Number(params.unitCost || 0);
      } else {
        nextAvg = Number(
          (((currentQty * currentAvg) + delta * Number(params.unitCost || 0)) / (currentQty + delta)).toFixed(2),
        );
      }
    }

    balance.onHandQty = nextQty;
    balance.availableQty = Number((nextQty - Number(balance.reservedQty || 0)).toFixed(3));
    balance.averageCost = nextAvg;
    balance.lastMovementAt = params.movementDate;

    return balanceRepo.save(balance);
  }

  private async createLedgerEntry(
    manager: any,
    params: {
      organizationId: string;
      documentId: string;
      documentItemId: string;
      materialId: string;
      warehouseId: string;
      projectId?: string;
      movementDate: Date;
      movementType: StockDocumentType;
      direction: MovementDirection;
      qty: number;
      unitCost: number;
      note?: string;
    },
  ) {
    const ledgerRepo = manager.getRepository(StockLedger) as Repository<StockLedger>;
    const ledger = ledgerRepo.create({
      organizationId: params.organizationId,
      documentId: params.documentId,
      documentItemId: params.documentItemId,
      materialId: params.materialId,
      warehouseId: params.warehouseId,
      projectId: params.projectId,
      movementDate: params.movementDate,
      movementType: params.movementType,
      direction: params.direction,
      qtyIn: params.direction === MovementDirection.IN ? params.qty : 0,
      qtyOut: params.direction === MovementDirection.OUT ? params.qty : 0,
      unitCost: params.unitCost,
      totalCost: Number((params.qty * params.unitCost).toFixed(2)),
      note: params.note,
    });
    return ledgerRepo.save(ledger);
  }

  async postStockDocument(id: string, actor: any, req?: any) {
    const document = await this.getStockDocument(id, actor.organizationId);
    if (document.status !== DocumentStatus.APPROVED) {
      throw new BadRequestException('Only approved document can be posted');
    }

    const movementDate = document.postingDate ? new Date(document.postingDate) : new Date();

    await this.dataSource.transaction(async (manager) => {
      const docRepo = manager.getRepository(StockDocument) as Repository<StockDocument>;
      const requestRepo = manager.getRepository(MaterialRequest) as Repository<MaterialRequest>;
      const requestItemRepo = manager.getRepository(MaterialRequestItem) as Repository<MaterialRequestItem>;

      const txDocument = await docRepo.findOne({
        where: { id: document.id },
        relations: { items: true },
      });
      if (!txDocument) {
        throw new NotFoundException('Stock document not found during posting');
      }
      if (txDocument.status === DocumentStatus.POSTED) {
        throw new BadRequestException('Document already posted');
      }

      for (const item of txDocument.items) {
        const qty = Number(item.qty);
        if (qty === 0) {
          continue;
        }

        if (txDocument.type === StockDocumentType.RECEIPT || txDocument.type === StockDocumentType.RETURN_FROM_SITE) {
          const balance = await this.upsertInventoryBalance(manager, {
            organizationId: txDocument.organizationId,
            materialId: item.materialId,
            warehouseId: txDocument.destinationWarehouseId!,
            qtyDelta: qty,
            unitCost: Number(item.unitCost || 0),
            movementDate,
          });

          await this.createLedgerEntry(manager, {
            organizationId: txDocument.organizationId,
            documentId: txDocument.id,
            documentItemId: item.id,
            materialId: item.materialId,
            warehouseId: txDocument.destinationWarehouseId!,
            projectId: txDocument.projectId,
            movementDate,
            movementType: txDocument.type,
            direction: MovementDirection.IN,
            qty,
            unitCost: Number(item.unitCost || balance.averageCost || 0),
            note: txDocument.note,
          });
        } else if (txDocument.type === StockDocumentType.ISSUE || txDocument.type === StockDocumentType.RETURN_TO_SUPPLIER) {
          const existingBalance = await (manager.getRepository(InventoryBalance) as Repository<InventoryBalance>).findOne({
            where: {
              organizationId: txDocument.organizationId,
              materialId: item.materialId,
              warehouseId: txDocument.sourceWarehouseId!,
            },
          });
          const unitCost = Number(existingBalance?.averageCost || item.unitCost || 0);
          await this.upsertInventoryBalance(manager, {
            organizationId: txDocument.organizationId,
            materialId: item.materialId,
            warehouseId: txDocument.sourceWarehouseId!,
            qtyDelta: -qty,
            unitCost,
            movementDate,
          });
          await this.createLedgerEntry(manager, {
            organizationId: txDocument.organizationId,
            documentId: txDocument.id,
            documentItemId: item.id,
            materialId: item.materialId,
            warehouseId: txDocument.sourceWarehouseId!,
            projectId: txDocument.projectId,
            movementDate,
            movementType: txDocument.type,
            direction: MovementDirection.OUT,
            qty,
            unitCost,
            note: txDocument.note,
          });
        } else if (txDocument.type === StockDocumentType.TRANSFER) {
          const existingBalance = await (manager.getRepository(InventoryBalance) as Repository<InventoryBalance>).findOne({
            where: {
              organizationId: txDocument.organizationId,
              materialId: item.materialId,
              warehouseId: txDocument.sourceWarehouseId!,
            },
          });
          const transferCost = Number(existingBalance?.averageCost || item.unitCost || 0);
          await this.upsertInventoryBalance(manager, {
            organizationId: txDocument.organizationId,
            materialId: item.materialId,
            warehouseId: txDocument.sourceWarehouseId!,
            qtyDelta: -qty,
            unitCost: transferCost,
            movementDate,
          });
          await this.createLedgerEntry(manager, {
            organizationId: txDocument.organizationId,
            documentId: txDocument.id,
            documentItemId: item.id,
            materialId: item.materialId,
            warehouseId: txDocument.sourceWarehouseId!,
            projectId: txDocument.projectId,
            movementDate,
            movementType: txDocument.type,
            direction: MovementDirection.OUT,
            qty,
            unitCost: transferCost,
            note: txDocument.note,
          });

          await this.upsertInventoryBalance(manager, {
            organizationId: txDocument.organizationId,
            materialId: item.materialId,
            warehouseId: txDocument.destinationWarehouseId!,
            qtyDelta: qty,
            unitCost: transferCost,
            movementDate,
          });
          await this.createLedgerEntry(manager, {
            organizationId: txDocument.organizationId,
            documentId: txDocument.id,
            documentItemId: item.id,
            materialId: item.materialId,
            warehouseId: txDocument.destinationWarehouseId!,
            projectId: txDocument.projectId,
            movementDate,
            movementType: txDocument.type,
            direction: MovementDirection.IN,
            qty,
            unitCost: transferCost,
            note: txDocument.note,
          });
        } else if (txDocument.type === StockDocumentType.ADJUSTMENT) {
          const warehouseId = txDocument.destinationWarehouseId || txDocument.sourceWarehouseId;
          if (!warehouseId) {
            throw new BadRequestException('Adjustment requires a warehouse');
          }
          const existingBalance = await (manager.getRepository(InventoryBalance) as Repository<InventoryBalance>).findOne({
            where: { organizationId: txDocument.organizationId, materialId: item.materialId, warehouseId },
          });
          const adjustmentCost = Number(existingBalance?.averageCost || item.unitCost || 0);
          await this.upsertInventoryBalance(manager, {
            organizationId: txDocument.organizationId,
            materialId: item.materialId,
            warehouseId,
            qtyDelta: qty,
            unitCost: adjustmentCost,
            movementDate,
          });
          await this.createLedgerEntry(manager, {
            organizationId: txDocument.organizationId,
            documentId: txDocument.id,
            documentItemId: item.id,
            materialId: item.materialId,
            warehouseId,
            projectId: txDocument.projectId,
            movementDate,
            movementType: txDocument.type,
            direction: qty >= 0 ? MovementDirection.IN : MovementDirection.OUT,
            qty: Math.abs(qty),
            unitCost: adjustmentCost,
            note: txDocument.note,
          });
        }
      }

      if (txDocument.requestId && txDocument.type === StockDocumentType.ISSUE) {
        const request = await requestRepo.findOne({ where: { id: txDocument.requestId }, relations: { items: true } });
        if (request) {
          for (const documentItem of txDocument.items) {
            const requestItem = request.items.find((item) => item.materialId === documentItem.materialId);
            if (requestItem) {
              requestItem.issuedQty = Number((Number(requestItem.issuedQty || 0) + Number(documentItem.qty)).toFixed(3));
              await requestItemRepo.save(requestItem);
            }
          }
          const requestItems = await requestItemRepo.find({ where: { requestId: request.id } });
          const fulfilled = requestItems.every(
            (item) => Number(item.issuedQty || 0) >= Number(item.approvedQty || item.requestedQty || 0),
          );
          request.status = fulfilled ? MaterialRequestStatus.FULFILLED : MaterialRequestStatus.PARTIAL;
          await requestRepo.save(request);
        }
      }

      txDocument.status = DocumentStatus.POSTED;
      txDocument.postedById = actor.sub;
      txDocument.postingDate = movementDate.toISOString().slice(0, 10);
      await docRepo.save(txDocument);
    });

    const posted = await this.getStockDocument(id, actor.organizationId);
    await this.auditService.log({
      organizationId: actor.organizationId,
      userId: actor.sub,
      action: AuditAction.POST,
      module: 'stock-documents',
      entityId: posted.id,
      newValues: { status: posted.status, postedById: actor.sub },
      ip: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });

    return posted;
  }
}
