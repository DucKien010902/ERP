import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { Material } from './material.entity';
import { StockDocument } from './stock-document.entity';

@Entity('stock_document_items')
export class StockDocumentItem extends AppBaseEntity {
  @Column({ name: 'document_id', type: 'char', length: 36 })
  documentId: string;

  @ManyToOne(() => StockDocument, (document) => document.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'document_id' })
  document: StockDocument;

  @Column({ name: 'material_id', type: 'char', length: 36 })
  materialId: string;

  @ManyToOne(() => Material, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'material_id' })
  material: Material;

  @Column({ type: 'decimal', precision: 15, scale: 3 })
  qty: number;

  @Column({ name: 'unit_cost', type: 'decimal', precision: 15, scale: 2, default: 0 })
  unitCost: number;

  @Column({ name: 'tax_rate', type: 'decimal', precision: 5, scale: 2, default: 0 })
  taxRate: number;

  @Column({ name: 'line_total', type: 'decimal', precision: 15, scale: 2, default: 0 })
  lineTotal: number;

  @Column({ name: 'batch_no', length: 80, nullable: true })
  batchNo?: string;

  @Column({ name: 'serial_no', length: 80, nullable: true })
  serialNo?: string;

  @Column({ type: 'text', nullable: true })
  note?: string;
}
