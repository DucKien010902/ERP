import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { PurchaseOrderStatus } from '../common/enums';
import { AppBaseEntity } from './base.entity';
import { Organization } from './organization.entity';
import { Project } from './project.entity';
import { PurchaseOrderItem } from './purchase-order-item.entity';
import { Supplier } from './supplier.entity';
import { User } from './user.entity';
import { Warehouse } from './warehouse.entity';

@Entity('purchase_orders')
@Index(['organizationId', 'poNo'], { unique: true })
export class PurchaseOrder extends AppBaseEntity {
  @Column({ name: 'organization_id', type: 'char', length: 36 })
  organizationId: string;

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ name: 'po_no', length: 50 })
  poNo: string;

  @Column({ name: 'supplier_id', type: 'char', length: 36 })
  supplierId: string;

  @ManyToOne(() => Supplier, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column({ name: 'project_id', type: 'char', length: 36, nullable: true })
  projectId?: string;

  @ManyToOne(() => Project, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'project_id' })
  project?: Project;

  @Column({ name: 'warehouse_id', type: 'char', length: 36, nullable: true })
  warehouseId?: string;

  @ManyToOne(() => Warehouse, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse?: Warehouse;

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

  @Column({ name: 'order_date', type: 'date', nullable: true })
  orderDate?: string;

  @Column({ name: 'expected_delivery_date', type: 'date', nullable: true })
  expectedDeliveryDate?: string;

  @Column({ type: 'enum', enum: PurchaseOrderStatus, default: PurchaseOrderStatus.DRAFT })
  status: PurchaseOrderStatus;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  subtotal: number;

  @Column({ name: 'tax_total', type: 'decimal', precision: 15, scale: 2, default: 0 })
  taxTotal: number;

  @Column({ name: 'grand_total', type: 'decimal', precision: 15, scale: 2, default: 0 })
  grandTotal: number;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @OneToMany(() => PurchaseOrderItem, (item) => item.purchaseOrder, { cascade: true, eager: true })
  items: PurchaseOrderItem[];
}
