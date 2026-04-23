import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { MovementDirection, StockDocumentType } from '../common/enums';
import { AppBaseEntity } from './base.entity';
import { Material } from './material.entity';
import { Organization } from './organization.entity';
import { Project } from './project.entity';
import { StockDocument } from './stock-document.entity';
import { StockDocumentItem } from './stock-document-item.entity';
import { Warehouse } from './warehouse.entity';

@Entity('stock_ledger')
@Index(['organizationId', 'movementDate'])
export class StockLedger extends AppBaseEntity {
  @Column({ name: 'organization_id', type: 'char', length: 36 })
  organizationId: string;

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ name: 'document_id', type: 'char', length: 36 })
  documentId: string;

  @ManyToOne(() => StockDocument, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'document_id' })
  document: StockDocument;

  @Column({ name: 'document_item_id', type: 'char', length: 36 })
  documentItemId: string;

  @ManyToOne(() => StockDocumentItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'document_item_id' })
  documentItem: StockDocumentItem;

  @Column({ name: 'material_id', type: 'char', length: 36 })
  materialId: string;

  @ManyToOne(() => Material, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'material_id' })
  material: Material;

  @Column({ name: 'warehouse_id', type: 'char', length: 36 })
  warehouseId: string;

  @ManyToOne(() => Warehouse, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column({ name: 'project_id', type: 'char', length: 36, nullable: true })
  projectId?: string;

  @ManyToOne(() => Project, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'project_id' })
  project?: Project;

  @Column({ name: 'movement_date', type: 'datetime' })
  movementDate: Date;

  @Column({ type: 'enum', enum: StockDocumentType })
  movementType: StockDocumentType;

  @Column({ type: 'enum', enum: MovementDirection })
  direction: MovementDirection;

  @Column({ name: 'qty_in', type: 'decimal', precision: 15, scale: 3, default: 0 })
  qtyIn: number;

  @Column({ name: 'qty_out', type: 'decimal', precision: 15, scale: 3, default: 0 })
  qtyOut: number;

  @Column({ name: 'unit_cost', type: 'decimal', precision: 15, scale: 2, default: 0 })
  unitCost: number;

  @Column({ name: 'total_cost', type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalCost: number;

  @Column({ type: 'text', nullable: true })
  note?: string;
}
