import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { Material } from './material.entity';
import { Organization } from './organization.entity';
import { Warehouse } from './warehouse.entity';

@Entity('inventory_balances')
@Index(['organizationId', 'materialId', 'warehouseId'], { unique: true })
export class InventoryBalance extends AppBaseEntity {
  @Column({ name: 'organization_id', type: 'char', length: 36 })
  organizationId: string;

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

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

  @Column({ name: 'on_hand_qty', type: 'decimal', precision: 15, scale: 3, default: 0 })
  onHandQty: number;

  @Column({ name: 'reserved_qty', type: 'decimal', precision: 15, scale: 3, default: 0 })
  reservedQty: number;

  @Column({ name: 'available_qty', type: 'decimal', precision: 15, scale: 3, default: 0 })
  availableQty: number;

  @Column({ name: 'average_cost', type: 'decimal', precision: 15, scale: 2, default: 0 })
  averageCost: number;

  @Column({ name: 'last_movement_at', type: 'datetime', nullable: true })
  lastMovementAt?: Date;
}
