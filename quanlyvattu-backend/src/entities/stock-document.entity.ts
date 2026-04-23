import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { DocumentStatus, StockDocumentType } from '../common/enums';
import { AppBaseEntity } from './base.entity';
import { MaterialRequest } from './material-request.entity';
import { Organization } from './organization.entity';
import { Project } from './project.entity';
import { StockDocumentItem } from './stock-document-item.entity';
import { SupplierInvoice } from './supplier-invoice.entity';
import { Supplier } from './supplier.entity';
import { User } from './user.entity';
import { Warehouse } from './warehouse.entity';

@Entity('stock_documents')
@Index(['organizationId', 'documentNo'], { unique: true })
export class StockDocument extends AppBaseEntity {
  @Column({ name: 'organization_id', type: 'char', length: 36 })
  organizationId: string;

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ name: 'document_no', length: 50 })
  documentNo: string;

  @Column({ type: 'enum', enum: StockDocumentType })
  type: StockDocumentType;

  @Column({ type: 'enum', enum: DocumentStatus, default: DocumentStatus.DRAFT })
  status: DocumentStatus;

  @Column({ name: 'reference_no', length: 80, nullable: true })
  referenceNo?: string;

  @Column({ name: 'project_id', type: 'char', length: 36, nullable: true })
  projectId?: string;

  @ManyToOne(() => Project, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'project_id' })
  project?: Project;

  @Column({ name: 'supplier_id', type: 'char', length: 36, nullable: true })
  supplierId?: string;

  @ManyToOne(() => Supplier, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'supplier_id' })
  supplier?: Supplier;

  @Column({ name: 'invoice_id', type: 'char', length: 36, nullable: true })
  invoiceId?: string;

  @ManyToOne(() => SupplierInvoice, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'invoice_id' })
  invoice?: SupplierInvoice;

  @Column({ name: 'request_id', type: 'char', length: 36, nullable: true })
  requestId?: string;

  @ManyToOne(() => MaterialRequest, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'request_id' })
  request?: MaterialRequest;

  @Column({ name: 'source_warehouse_id', type: 'char', length: 36, nullable: true })
  sourceWarehouseId?: string;

  @ManyToOne(() => Warehouse, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'source_warehouse_id' })
  sourceWarehouse?: Warehouse;

  @Column({ name: 'destination_warehouse_id', type: 'char', length: 36, nullable: true })
  destinationWarehouseId?: string;

  @ManyToOne(() => Warehouse, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'destination_warehouse_id' })
  destinationWarehouse?: Warehouse;

  @Column({ name: 'created_by_id', type: 'char', length: 36 })
  createdById: string;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @Column({ name: 'approved_by_id', type: 'char', length: 36, nullable: true })
  approvedById?: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'approved_by_id' })
  approvedBy?: User;

  @Column({ name: 'posted_by_id', type: 'char', length: 36, nullable: true })
  postedById?: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'posted_by_id' })
  postedBy?: User;

  @Column({ name: 'document_date', type: 'date', nullable: true })
  documentDate?: string;

  @Column({ name: 'posting_date', type: 'date', nullable: true })
  postingDate?: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  subtotal: number;

  @Column({ name: 'tax_total', type: 'decimal', precision: 15, scale: 2, default: 0 })
  taxTotal: number;

  @Column({ name: 'grand_total', type: 'decimal', precision: 15, scale: 2, default: 0 })
  grandTotal: number;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @OneToMany(() => StockDocumentItem, (item) => item.document, { cascade: true, eager: true })
  items: StockDocumentItem[];
}
