import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import { Repository } from 'typeorm';
import {
  DocumentStatus,
  InvoiceStatus,
  MaterialRequestStatus,
  MovementDirection,
  PaymentStatus,
  ProjectStatus,
  PurchaseOrderStatus,
  StockDocumentType,
  WarehouseType,
} from '../common/enums';
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

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);
  private hasBootstrapped = false;
  private static readonly DEFAULT_ORGANIZATION = {
    code: 'WMKALLA',
    name: 'WM Kalla Construction Materials',
    taxCode: '0312345678',
    address: 'Thu Duc, Ho Chi Minh City',
    email: 'hello@wmkalla.local',
    phone: '0909000111',
    isActive: true,
  } as const;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
    @InjectRepository(InventoryBalance)
    private readonly inventoryBalanceRepository: Repository<InventoryBalance>,
    @InjectRepository(StockLedger)
    private readonly stockLedgerRepository: Repository<StockLedger>,
  ) {}

  async onApplicationBootstrap() {
    if (this.hasBootstrapped) {
      return;
    }
    this.hasBootstrapped = true;

    const autoSeed = String(this.configService.get('AUTO_SEED') ?? 'true') === 'true';
    if (autoSeed) {
      await this.run();
    }
  }

  async run() {
    type PermissionSeed = [code: string, name: string, group: string];
    type UserSeed = [
      fullName: string,
      email: string,
      phone: string,
      password: string,
      roleCodes: string[],
    ];
    type UnitSeed = [code: string, name: string, symbol: string];
    type CategorySeed = [code: string, name: string];
    type MaterialSeed = [
      code: string,
      sku: string,
      name: string,
      categoryCode: string,
      unitCode: string,
      brand: string,
      specification: string,
      minStock: number,
      maxStock: number,
    ];
    type WarehouseSeed = [
      code: string,
      name: string,
      type: WarehouseType,
      address: string,
      managerName: string,
    ];
    type ProjectSeed = [
      code: string,
      name: string,
      location: string,
      status: ProjectStatus,
      startDate: string,
      endDate: string,
      managerName: string,
    ];
    type SupplierSeed = [
      code: string,
      name: string,
      taxCode: string,
      address: string,
      contactName: string,
      phone: string,
      email: string,
      paymentTerms: string,
    ];

    const organizationSeed = SeedService.DEFAULT_ORGANIZATION;
    const existingOrg = await this.organizationRepository.findOne({ where: { code: organizationSeed.code } });
    if (existingOrg) {
      this.logger.log(`Seed skipped because ${organizationSeed.code} organization already exists`);
      return { skipped: true };
    }

    this.logger.log('Seeding demo data...');

    const organization = await this.organizationRepository.save(
      this.organizationRepository.create(organizationSeed),
    );

    const permissionSeeds: PermissionSeed[] = [
      ['roles.read', 'View roles & permissions', 'access'],
      ['users.read', 'View users', 'users'],
      ['users.write', 'Create/update users', 'users'],
      ['masters.read', 'View master data', 'masters'],
      ['masters.write', 'Manage master data', 'masters'],
      ['requests.read', 'View material requests', 'requests'],
      ['requests.write', 'Create material requests', 'requests'],
      ['requests.submit', 'Submit material requests', 'requests'],
      ['requests.approve', 'Approve material requests', 'requests'],
      ['purchase-orders.read', 'View purchase orders', 'purchase-orders'],
      ['purchase-orders.write', 'Create purchase orders', 'purchase-orders'],
      ['purchase-orders.approve', 'Approve purchase orders', 'purchase-orders'],
      ['stock-documents.read', 'View stock documents', 'stock-documents'],
      ['stock-documents.write', 'Create stock documents', 'stock-documents'],
      ['stock-documents.submit', 'Submit stock documents', 'stock-documents'],
      ['stock-documents.approve', 'Approve stock documents', 'stock-documents'],
      ['stock-documents.post', 'Post stock documents', 'stock-documents'],
      ['inventory.read', 'View inventory', 'inventory'],
      ['inventory.adjust', 'Adjust inventory', 'inventory'],
      ['invoices.read', 'View supplier invoices', 'invoices'],
      ['invoices.write', 'Create supplier invoices', 'invoices'],
      ['invoices.approve', 'Approve supplier invoices', 'invoices'],
      ['reports.read', 'View reports & dashboard', 'reports'],
      ['audits.read', 'View audit logs', 'audits'],
    ];

    const permissionMap = new Map<string, Permission>();
    for (const [code, name, group] of permissionSeeds) {
      const permission = await this.permissionRepository.save(
        this.permissionRepository.create({ code, name, group }),
      );
      permissionMap.set(code, permission);
    }

    const roleSeeds: Record<string, string[]> = {
      SUPER_ADMIN: ['*'],
      COMPANY_ADMIN: [
        'roles.read',
        'users.read',
        'users.write',
        'masters.read',
        'masters.write',
        'requests.read',
        'requests.write',
        'requests.submit',
        'requests.approve',
        'purchase-orders.read',
        'purchase-orders.write',
        'purchase-orders.approve',
        'stock-documents.read',
        'stock-documents.write',
        'stock-documents.submit',
        'stock-documents.approve',
        'stock-documents.post',
        'inventory.read',
        'inventory.adjust',
        'invoices.read',
        'invoices.write',
        'invoices.approve',
        'reports.read',
        'audits.read',
      ],
      PROCUREMENT_MANAGER: [
        'masters.read',
        'purchase-orders.read',
        'purchase-orders.write',
        'purchase-orders.approve',
        'invoices.read',
        'invoices.write',
        'invoices.approve',
        'reports.read',
        'inventory.read',
      ],
      WAREHOUSE_MANAGER: [
        'masters.read',
        'requests.read',
        'stock-documents.read',
        'stock-documents.write',
        'stock-documents.submit',
        'stock-documents.approve',
        'stock-documents.post',
        'inventory.read',
        'inventory.adjust',
        'reports.read',
        'purchase-orders.read',
        'invoices.read',
      ],
      SITE_MANAGER: [
        'masters.read',
        'requests.read',
        'requests.write',
        'requests.submit',
        'requests.approve',
        'stock-documents.read',
        'stock-documents.write',
        'stock-documents.submit',
        'inventory.read',
        'reports.read',
      ],
      SITE_STAFF: [
        'masters.read',
        'requests.read',
        'requests.write',
        'requests.submit',
        'stock-documents.read',
        'inventory.read',
      ],
      ACCOUNTANT: ['invoices.read', 'invoices.write', 'invoices.approve', 'stock-documents.read', 'reports.read', 'inventory.read'],
      EXECUTIVE_VIEWER: ['reports.read', 'inventory.read', 'stock-documents.read', 'requests.read', 'purchase-orders.read', 'invoices.read'],
    };

    const roleMap = new Map<string, Role>();
    for (const [code, permissions] of Object.entries(roleSeeds)) {
      const role = this.roleRepository.create({
        code,
        name: code.replace(/_/g, ' '),
        description: `${code.replace(/_/g, ' ')} role`,
        isSystem: true,
        permissions:
          permissions[0] === '*'
            ? Array.from(permissionMap.values())
            : permissions.map((permission) => permissionMap.get(permission)!).filter(Boolean),
      });
      const savedRole = await this.roleRepository.save(role);
      roleMap.set(code, savedRole);
    }

    const userSeeds: UserSeed[] = [
      ['Nguyen Duc Kien', 'admin@wmkalla.local', '0909000001', 'Admin@123', ['SUPER_ADMIN']],
      ['Tran Minh Quan', 'company.admin@wmkalla.local', '0909000002', 'Admin@123', ['COMPANY_ADMIN']],
      ['Le Phuong Anh', 'procurement@wmkalla.local', '0909000003', 'Procurement@123', ['PROCUREMENT_MANAGER']],
      ['Pham Hoang Hai', 'warehouse@wmkalla.local', '0909000004', 'Warehouse@123', ['WAREHOUSE_MANAGER']],
      ['Vo Thanh Lam', 'site.manager@wmkalla.local', '0909000005', 'Site@123', ['SITE_MANAGER']],
      ['Bui Thu Ha', 'site.staff@wmkalla.local', '0909000006', 'Site@123', ['SITE_STAFF']],
      ['Nguyen Thi Nga', 'accountant@wmkalla.local', '0909000007', 'Accountant@123', ['ACCOUNTANT']],
      ['Do Viet Hung', 'director@wmkalla.local', '0909000008', 'Director@123', ['EXECUTIVE_VIEWER']],
    ];

    const userMap = new Map<string, User>();
    for (const [fullName, email, phone, password, roleCodes] of userSeeds) {
      const user = this.userRepository.create({
        organizationId: organization.id,
        fullName,
        email,
        phone,
        passwordHash: await hash(password, 10),
        isActive: true,
        roles: roleCodes.map((code) => roleMap.get(code)!).filter(Boolean),
      });
      const savedUser = await this.userRepository.save(user);
      userMap.set(email, savedUser);
    }

    const unitSeeds: UnitSeed[] = [
      ['PCS', 'Piece', 'pcs'],
      ['KG', 'Kilogram', 'kg'],
      ['M', 'Meter', 'm'],
      ['M3', 'Cubic Meter', 'm3'],
      ['BAG', 'Bag', 'bag'],
    ];
    const unitMap = new Map<string, Unit>();
    for (const [code, name, symbol] of unitSeeds) {
      const saved = await this.unitRepository.save(
        this.unitRepository.create({ organizationId: organization.id, code, name, symbol }),
      );
      unitMap.set(code, saved);
    }

    const categorySeeds: CategorySeed[] = [
      ['STEEL', 'Steel'],
      ['CEMENT', 'Cement & Concrete'],
      ['ELECTRICAL', 'Electrical'],
      ['SAFETY', 'Safety Equipment'],
    ];
    const categoryMap = new Map<string, MaterialCategory>();
    for (const [code, name] of categorySeeds) {
      const saved = await this.categoryRepository.save(
        this.categoryRepository.create({ organizationId: organization.id, code, name }),
      );
      categoryMap.set(code, saved);
    }

    const materialSeeds: MaterialSeed[] = [
      ['VT-STEEL-001', 'REBAR-D16', 'Rebar D16', 'STEEL', 'KG', 'Hoa Phat', 'Steel bar D16', 1000, 10000],
      ['VT-CEMENT-001', 'CEMENT-PC40', 'Cement PC40', 'CEMENT', 'BAG', 'Holcim', 'PCB40 50kg', 100, 2000],
      ['VT-SAND-001', 'SAND-BUILD', 'Construction Sand', 'CEMENT', 'M3', 'Local', 'Clean building sand', 20, 500],
      ['VT-ELEC-001', 'CABLE-CU-2.5', 'Copper Cable 2.5mm', 'ELECTRICAL', 'M', 'Cadivi', 'Electrical cable 2.5mm', 300, 5000],
      ['VT-SAFE-001', 'HELMET-STD', 'Safety Helmet', 'SAFETY', 'PCS', '3M', 'Standard white helmet', 20, 200],
      ['VT-BOLT-001', 'BOLT-M12', 'Bolt M12', 'STEEL', 'PCS', 'OEM', 'Hex bolt M12', 200, 2000],
    ];
    const materialMap = new Map<string, Material>();
    for (const [code, sku, name, categoryCode, unitCode, brand, specification, minStock, maxStock] of materialSeeds) {
      const saved = await this.materialRepository.save(
        this.materialRepository.create({
          organizationId: organization.id,
          code,
          sku,
          name,
          categoryId: categoryMap.get(categoryCode)!.id,
          unitId: unitMap.get(unitCode)!.id,
          brand,
          specification,
          minStock,
          maxStock,
          isActive: true,
        }),
      );
      materialMap.set(code, saved);
    }

    const warehouseSeeds: WarehouseSeed[] = [
      ['KHO-TT', 'Central Warehouse', WarehouseType.MAIN, 'Thu Duc, HCMC', 'Pham Hoang Hai'],
      ['KHO-DA-TA', 'Tower A Site Warehouse', WarehouseType.SITE, 'District 7, HCMC', 'Vo Thanh Lam'],
      ['KHO-TRANS', 'Transit Warehouse', WarehouseType.TRANSIT, 'Binh Duong', 'Tran Van Tai'],
    ];
    const warehouseMap = new Map<string, Warehouse>();
    for (const [code, name, type, address, managerName] of warehouseSeeds) {
      const saved = await this.warehouseRepository.save(
        this.warehouseRepository.create({ organizationId: organization.id, code, name, type, address, managerName }),
      );
      warehouseMap.set(code, saved);
    }

    const projectSeeds: ProjectSeed[] = [
      ['DUAN-TA', 'Tower A Apartment Project', 'District 7, HCMC', ProjectStatus.ACTIVE, '2026-01-10', '2026-12-20', 'Vo Thanh Lam'],
      ['DUAN-RB', 'Ring Road Package B', 'Thu Duc, HCMC', ProjectStatus.ACTIVE, '2026-02-15', '2027-03-30', 'Nguyen Quoc Binh'],
    ];
    const projectMap = new Map<string, Project>();
    for (const [code, name, location, status, startDate, endDate, managerName] of projectSeeds) {
      const saved = await this.projectRepository.save(
        this.projectRepository.create({
          organizationId: organization.id,
          code,
          name,
          location,
          status,
          startDate,
          endDate,
          managerName,
        }),
      );
      projectMap.set(code, saved);
    }

    const supplierSeeds: SupplierSeed[] = [
      ['NCC-STEEL', 'Steel & Fastener Co', '0310001111', 'Binh Duong', 'Nguyen Van Phat', '0909111222', 'sales@steel.local', '30 days'],
      ['NCC-CEMENT', 'Concrete Supply Co', '0310002222', 'Dong Nai', 'Tran Thi Lan', '0909333444', 'ops@cement.local', '15 days'],
    ];
    const supplierMap = new Map<string, Supplier>();
    for (const [code, name, taxCode, address, contactName, phone, email, paymentTerms] of supplierSeeds) {
      const saved = await this.supplierRepository.save(
        this.supplierRepository.create({
          organizationId: organization.id,
          code,
          name,
          taxCode,
          address,
          contactName,
          phone,
          email,
          paymentTerms,
        }),
      );
      supplierMap.set(code, saved);
    }

    const siteManager = userMap.get('site.manager@wmkalla.local')!;
    const warehouseManager = userMap.get('warehouse@wmkalla.local')!;
    const procurementUser = userMap.get('procurement@wmkalla.local')!;
    const accountant = userMap.get('accountant@wmkalla.local')!;

    const request = await this.materialRequestRepository.save(
      this.materialRequestRepository.create({
        organizationId: organization.id,
        requestNo: 'MR-202604-0001',
        projectId: projectMap.get('DUAN-TA')!.id,
        warehouseId: warehouseMap.get('KHO-TT')!.id,
        requesterId: siteManager.id,
        approverId: siteManager.id,
        neededDate: '2026-04-10',
        purpose: 'Stage 1 structural reinforcement and PPE issuance',
        status: MaterialRequestStatus.FULFILLED,
      }),
    );
    await this.materialRequestItemRepository.save([
      this.materialRequestItemRepository.create({
        requestId: request.id,
        materialId: materialMap.get('VT-STEEL-001')!.id,
        requestedQty: 1200,
        approvedQty: 1200,
        issuedQty: 1200,
        note: 'Floor 5 reinforcement',
      }),
      this.materialRequestItemRepository.create({
        requestId: request.id,
        materialId: materialMap.get('VT-SAFE-001')!.id,
        requestedQty: 20,
        approvedQty: 20,
        issuedQty: 20,
        note: 'New worker onboarding batch',
      }),
    ]);

    const po = await this.purchaseOrderRepository.save(
      this.purchaseOrderRepository.create({
        organizationId: organization.id,
        poNo: 'PO-202604-0001',
        supplierId: supplierMap.get('NCC-STEEL')!.id,
        projectId: projectMap.get('DUAN-TA')!.id,
        warehouseId: warehouseMap.get('KHO-TT')!.id,
        createdById: procurementUser.id,
        approvedById: procurementUser.id,
        orderDate: '2026-04-01',
        expectedDeliveryDate: '2026-04-03',
        status: PurchaseOrderStatus.APPROVED,
        subtotal: 82000000,
        taxTotal: 8200000,
        grandTotal: 90200000,
        note: 'Main procurement batch for Tower A',
      }),
    );
    await this.purchaseOrderItemRepository.save([
      this.purchaseOrderItemRepository.create({
        purchaseOrderId: po.id,
        materialId: materialMap.get('VT-STEEL-001')!.id,
        qty: 3000,
        unitPrice: 18000,
        taxRate: 10,
        lineTotal: 54000000,
        receivedQty: 3000,
      }),
      this.purchaseOrderItemRepository.create({
        purchaseOrderId: po.id,
        materialId: materialMap.get('VT-SAFE-001')!.id,
        qty: 100,
        unitPrice: 120000,
        taxRate: 10,
        lineTotal: 12000000,
        receivedQty: 100,
      }),
      this.purchaseOrderItemRepository.create({
        purchaseOrderId: po.id,
        materialId: materialMap.get('VT-CEMENT-001')!.id,
        qty: 200,
        unitPrice: 80000,
        taxRate: 10,
        lineTotal: 16000000,
        receivedQty: 200,
      }),
    ]);

    const invoice = await this.supplierInvoiceRepository.save(
      this.supplierInvoiceRepository.create({
        organizationId: organization.id,
        invoiceNo: 'INV-202604-STEEL-001',
        supplierId: supplierMap.get('NCC-STEEL')!.id,
        purchaseOrderId: po.id,
        createdById: accountant.id,
        approvedById: accountant.id,
        invoiceDate: '2026-04-03',
        dueDate: '2026-05-03',
        status: InvoiceStatus.APPROVED,
        paymentStatus: PaymentStatus.UNPAID,
        subtotal: 82000000,
        taxTotal: 8200000,
        grandTotal: 90200000,
        attachmentUrl: 'https://example.com/demo/invoice-202604-steel-001.pdf',
        note: 'Demo supplier invoice for received materials',
      }),
    );
    await this.supplierInvoiceItemRepository.save([
      this.supplierInvoiceItemRepository.create({
        invoiceId: invoice.id,
        materialId: materialMap.get('VT-STEEL-001')!.id,
        qty: 3000,
        unitPrice: 18000,
        taxRate: 10,
        lineTotal: 54000000,
      }),
      this.supplierInvoiceItemRepository.create({
        invoiceId: invoice.id,
        materialId: materialMap.get('VT-SAFE-001')!.id,
        qty: 100,
        unitPrice: 120000,
        taxRate: 10,
        lineTotal: 12000000,
      }),
      this.supplierInvoiceItemRepository.create({
        invoiceId: invoice.id,
        materialId: materialMap.get('VT-CEMENT-001')!.id,
        qty: 200,
        unitPrice: 80000,
        taxRate: 10,
        lineTotal: 16000000,
      }),
    ]);

    const receiptDocument = await this.stockDocumentRepository.save(
      this.stockDocumentRepository.create({
        organizationId: organization.id,
        documentNo: 'STK-REC-202604-0001',
        type: StockDocumentType.RECEIPT,
        status: DocumentStatus.POSTED,
        referenceNo: invoice.invoiceNo,
        supplierId: supplierMap.get('NCC-STEEL')!.id,
        invoiceId: invoice.id,
        destinationWarehouseId: warehouseMap.get('KHO-TT')!.id,
        createdById: warehouseManager.id,
        approvedById: warehouseManager.id,
        postedById: warehouseManager.id,
        documentDate: '2026-04-03',
        postingDate: '2026-04-03',
        subtotal: 82000000,
        taxTotal: 8200000,
        grandTotal: 90200000,
        note: 'Goods receipt from supplier',
      }),
    );
    const receiptItems = await this.stockDocumentItemRepository.save([
      this.stockDocumentItemRepository.create({
        documentId: receiptDocument.id,
        materialId: materialMap.get('VT-STEEL-001')!.id,
        qty: 3000,
        unitCost: 18000,
        taxRate: 10,
        lineTotal: 54000000,
        batchNo: 'STEEL-APR-01',
      }),
      this.stockDocumentItemRepository.create({
        documentId: receiptDocument.id,
        materialId: materialMap.get('VT-SAFE-001')!.id,
        qty: 100,
        unitCost: 120000,
        taxRate: 10,
        lineTotal: 12000000,
      }),
      this.stockDocumentItemRepository.create({
        documentId: receiptDocument.id,
        materialId: materialMap.get('VT-CEMENT-001')!.id,
        qty: 200,
        unitCost: 80000,
        taxRate: 10,
        lineTotal: 16000000,
      }),
    ]);

    const issueDocument = await this.stockDocumentRepository.save(
      this.stockDocumentRepository.create({
        organizationId: organization.id,
        documentNo: 'STK-ISS-202604-0001',
        type: StockDocumentType.ISSUE,
        status: DocumentStatus.POSTED,
        projectId: projectMap.get('DUAN-TA')!.id,
        requestId: request.id,
        sourceWarehouseId: warehouseMap.get('KHO-TT')!.id,
        createdById: warehouseManager.id,
        approvedById: warehouseManager.id,
        postedById: warehouseManager.id,
        documentDate: '2026-04-05',
        postingDate: '2026-04-05',
        subtotal: 24000000,
        taxTotal: 0,
        grandTotal: 24000000,
        note: 'Issue materials for Tower A stage 1',
      }),
    );
    const issueItems = await this.stockDocumentItemRepository.save([
      this.stockDocumentItemRepository.create({
        documentId: issueDocument.id,
        materialId: materialMap.get('VT-STEEL-001')!.id,
        qty: 1200,
        unitCost: 18000,
        taxRate: 0,
        lineTotal: 21600000,
      }),
      this.stockDocumentItemRepository.create({
        documentId: issueDocument.id,
        materialId: materialMap.get('VT-SAFE-001')!.id,
        qty: 20,
        unitCost: 120000,
        taxRate: 0,
        lineTotal: 2400000,
      }),
    ]);

    await this.stockDocumentRepository.save(
      this.stockDocumentRepository.create({
        organizationId: organization.id,
        documentNo: 'STK-TRF-202604-0001',
        type: StockDocumentType.TRANSFER,
        status: DocumentStatus.APPROVED,
        sourceWarehouseId: warehouseMap.get('KHO-TT')!.id,
        destinationWarehouseId: warehouseMap.get('KHO-DA-TA')!.id,
        projectId: projectMap.get('DUAN-TA')!.id,
        createdById: warehouseManager.id,
        approvedById: warehouseManager.id,
        documentDate: '2026-04-06',
        postingDate: '2026-04-06',
        subtotal: 500000,
        taxTotal: 0,
        grandTotal: 500000,
        note: 'Approved transfer waiting to be posted',
        items: [
          this.stockDocumentItemRepository.create({
            materialId: materialMap.get('VT-ELEC-001')!.id,
            qty: 100,
            unitCost: 5000,
            taxRate: 0,
            lineTotal: 500000,
          }),
        ],
      }),
    );

    await this.inventoryBalanceRepository.save([
      this.inventoryBalanceRepository.create({
        organizationId: organization.id,
        materialId: materialMap.get('VT-STEEL-001')!.id,
        warehouseId: warehouseMap.get('KHO-TT')!.id,
        onHandQty: 1800,
        reservedQty: 0,
        availableQty: 1800,
        averageCost: 18000,
        lastMovementAt: new Date('2026-04-05T10:00:00'),
      }),
      this.inventoryBalanceRepository.create({
        organizationId: organization.id,
        materialId: materialMap.get('VT-SAFE-001')!.id,
        warehouseId: warehouseMap.get('KHO-TT')!.id,
        onHandQty: 80,
        reservedQty: 0,
        availableQty: 80,
        averageCost: 120000,
        lastMovementAt: new Date('2026-04-05T10:00:00'),
      }),
      this.inventoryBalanceRepository.create({
        organizationId: organization.id,
        materialId: materialMap.get('VT-CEMENT-001')!.id,
        warehouseId: warehouseMap.get('KHO-TT')!.id,
        onHandQty: 200,
        reservedQty: 0,
        availableQty: 200,
        averageCost: 80000,
        lastMovementAt: new Date('2026-04-03T08:00:00'),
      }),
      this.inventoryBalanceRepository.create({
        organizationId: organization.id,
        materialId: materialMap.get('VT-ELEC-001')!.id,
        warehouseId: warehouseMap.get('KHO-TT')!.id,
        onHandQty: 0,
        reservedQty: 0,
        availableQty: 0,
        averageCost: 5000,
        lastMovementAt: new Date('2026-04-06T08:00:00'),
      }),
    ]);

    await this.stockLedgerRepository.save([
      this.stockLedgerRepository.create({
        organizationId: organization.id,
        documentId: receiptDocument.id,
        documentItemId: receiptItems[0].id,
        materialId: materialMap.get('VT-STEEL-001')!.id,
        warehouseId: warehouseMap.get('KHO-TT')!.id,
        movementDate: new Date('2026-04-03T08:30:00'),
        movementType: StockDocumentType.RECEIPT,
        direction: MovementDirection.IN,
        qtyIn: 3000,
        qtyOut: 0,
        unitCost: 18000,
        totalCost: 54000000,
        note: 'Supplier receipt',
      }),
      this.stockLedgerRepository.create({
        organizationId: organization.id,
        documentId: receiptDocument.id,
        documentItemId: receiptItems[1].id,
        materialId: materialMap.get('VT-SAFE-001')!.id,
        warehouseId: warehouseMap.get('KHO-TT')!.id,
        movementDate: new Date('2026-04-03T08:30:00'),
        movementType: StockDocumentType.RECEIPT,
        direction: MovementDirection.IN,
        qtyIn: 100,
        qtyOut: 0,
        unitCost: 120000,
        totalCost: 12000000,
        note: 'Supplier receipt',
      }),
      this.stockLedgerRepository.create({
        organizationId: organization.id,
        documentId: receiptDocument.id,
        documentItemId: receiptItems[2].id,
        materialId: materialMap.get('VT-CEMENT-001')!.id,
        warehouseId: warehouseMap.get('KHO-TT')!.id,
        movementDate: new Date('2026-04-03T08:30:00'),
        movementType: StockDocumentType.RECEIPT,
        direction: MovementDirection.IN,
        qtyIn: 200,
        qtyOut: 0,
        unitCost: 80000,
        totalCost: 16000000,
        note: 'Supplier receipt',
      }),
      this.stockLedgerRepository.create({
        organizationId: organization.id,
        documentId: issueDocument.id,
        documentItemId: issueItems[0].id,
        materialId: materialMap.get('VT-STEEL-001')!.id,
        warehouseId: warehouseMap.get('KHO-TT')!.id,
        projectId: projectMap.get('DUAN-TA')!.id,
        movementDate: new Date('2026-04-05T10:00:00'),
        movementType: StockDocumentType.ISSUE,
        direction: MovementDirection.OUT,
        qtyIn: 0,
        qtyOut: 1200,
        unitCost: 18000,
        totalCost: 21600000,
        note: 'Issue to Tower A',
      }),
      this.stockLedgerRepository.create({
        organizationId: organization.id,
        documentId: issueDocument.id,
        documentItemId: issueItems[1].id,
        materialId: materialMap.get('VT-SAFE-001')!.id,
        warehouseId: warehouseMap.get('KHO-TT')!.id,
        projectId: projectMap.get('DUAN-TA')!.id,
        movementDate: new Date('2026-04-05T10:00:00'),
        movementType: StockDocumentType.ISSUE,
        direction: MovementDirection.OUT,
        qtyIn: 0,
        qtyOut: 20,
        unitCost: 120000,
        totalCost: 2400000,
        note: 'Issue to Tower A',
      }),
    ]);

    this.logger.log('Seed completed successfully');
    return {
      organizationId: organization.id,
      users: userSeeds.map(([fullName, email, , password]) => ({ fullName, email, password })),
    };
  }
}
