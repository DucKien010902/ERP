import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { Material } from './material.entity';
import { SupplierInvoice } from './supplier-invoice.entity';

@Entity('supplier_invoice_items')
export class SupplierInvoiceItem extends AppBaseEntity {
  @Column({ name: 'invoice_id', type: 'char', length: 36 })
  invoiceId: string;

  @ManyToOne(() => SupplierInvoice, (invoice) => invoice.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invoice_id' })
  invoice: SupplierInvoice;

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
}
