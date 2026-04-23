import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { Material } from './material.entity';
import { MaterialRequest } from './material-request.entity';

@Entity('material_request_items')
export class MaterialRequestItem extends AppBaseEntity {
  @Column({ name: 'request_id', type: 'char', length: 36 })
  requestId: string;

  @ManyToOne(() => MaterialRequest, (request) => request.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'request_id' })
  request: MaterialRequest;

  @Column({ name: 'material_id', type: 'char', length: 36 })
  materialId: string;

  @ManyToOne(() => Material, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'material_id' })
  material: Material;

  @Column({ name: 'requested_qty', type: 'decimal', precision: 15, scale: 3 })
  requestedQty: number;

  @Column({ name: 'approved_qty', type: 'decimal', precision: 15, scale: 3, default: 0 })
  approvedQty: number;

  @Column({ name: 'issued_qty', type: 'decimal', precision: 15, scale: 3, default: 0 })
  issuedQty: number;

  @Column({ type: 'text', nullable: true })
  note?: string;
}
