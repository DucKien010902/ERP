import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { Material } from './material.entity';
import { PurchaseOrder } from './purchase-order.entity';

@Entity('purchase_order_items')
export class PurchaseOrderItem extends AppBaseEntity {
  @Column({ name: 'purchase_order_id', type: 'char', length: 36 })
  purchaseOrderId: string;

  @ManyToOne(() => PurchaseOrder, (purchaseOrder) => purchaseOrder.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'purchase_order_id' })
  purchaseOrder: PurchaseOrder;

  @Column({ name: 'material_id', type: 'char', length: 36 })
  materialId: string;

  @ManyToOne(() => Material, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'material_id' })
  material: Material;

  @Column({ type: 'decimal', precision: 15, scale: 3 })
  qty: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 15, scale: 2, default: 0 })
  unitPrice: number;

  @Column({ name: 'tax_rate', type: 'decimal', precision: 5, scale: 2, default: 0 })
  taxRate: number;

  @Column({ name: 'line_total', type: 'decimal', precision: 15, scale: 2, default: 0 })
  lineTotal: number;

  @Column({ name: 'received_qty', type: 'decimal', precision: 15, scale: 3, default: 0 })
  receivedQty: number;
}
