import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { InvoiceStatus, PaymentStatus } from '../common/enums';
import { AppBaseEntity } from './base.entity';
import { Organization } from './organization.entity';
import { PurchaseOrder } from './purchase-order.entity';
import { SupplierInvoiceItem } from './supplier-invoice-item.entity';
import { Supplier } from './supplier.entity';
import { User } from './user.entity';

@Entity('supplier_invoices')
@Index(['organizationId', 'invoiceNo'], { unique: true })
export class SupplierInvoice extends AppBaseEntity {
  @Column({ name: 'organization_id', type: 'char', length: 36 })
  organizationId: string;

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ name: 'invoice_no', length: 80 })
  invoiceNo: string;

  @Column({ name: 'supplier_id', type: 'char', length: 36 })
  supplierId: string;

  @ManyToOne(() => Supplier, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column({ name: 'purchase_order_id', type: 'char', length: 36, nullable: true })
  purchaseOrderId?: string;

  @ManyToOne(() => PurchaseOrder, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'purchase_order_id' })
  purchaseOrder?: PurchaseOrder;

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

  @Column({ name: 'invoice_date', type: 'date', nullable: true })
  invoiceDate?: string;

  @Column({ name: 'due_date', type: 'date', nullable: true })
  dueDate?: string;

  @Column({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.DRAFT })
  status: InvoiceStatus;

  @Column({ name: 'payment_status', type: 'enum', enum: PaymentStatus, default: PaymentStatus.UNPAID })
  paymentStatus: PaymentStatus;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  subtotal: number;

  @Column({ name: 'tax_total', type: 'decimal', precision: 15, scale: 2, default: 0 })
  taxTotal: number;

  @Column({ name: 'grand_total', type: 'decimal', precision: 15, scale: 2, default: 0 })
  grandTotal: number;

  @Column({ name: 'attachment_url', length: 500, nullable: true })
  attachmentUrl?: string;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @OneToMany(() => SupplierInvoiceItem, (item) => item.invoice, { cascade: true, eager: true })
  items: SupplierInvoiceItem[];
}
