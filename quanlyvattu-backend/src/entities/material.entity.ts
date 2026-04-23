import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { MaterialCategory } from './material-category.entity';
import { Organization } from './organization.entity';
import { Unit } from './unit.entity';

@Entity('materials')
@Index(['organizationId', 'code'], { unique: true })
@Index(['organizationId', 'sku'], { unique: true })
export class Material extends AppBaseEntity {
  @Column({ name: 'organization_id', type: 'char', length: 36 })
  organizationId: string;

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ length: 80 })
  code: string;

  @Column({ length: 80 })
  sku: string;

  @Column({ length: 150 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'category_id', type: 'char', length: 36 })
  categoryId: string;

  @ManyToOne(() => MaterialCategory, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'category_id' })
  category: MaterialCategory;

  @Column({ name: 'unit_id', type: 'char', length: 36 })
  unitId: string;

  @ManyToOne(() => Unit, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'unit_id' })
  unit: Unit;

  @Column({ length: 120, nullable: true })
  brand?: string;

  @Column({ length: 255, nullable: true })
  specification?: string;

  @Column({ name: 'min_stock', type: 'decimal', precision: 15, scale: 3, default: 0 })
  minStock: number;

  @Column({ name: 'max_stock', type: 'decimal', precision: 15, scale: 3, default: 0 })
  maxStock: number;

  @Column({ name: 'track_batch', default: false })
  trackBatch: boolean;

  @Column({ name: 'track_serial', default: false })
  trackSerial: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
