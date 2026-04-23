import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { WarehouseType } from '../common/enums';
import { AppBaseEntity } from './base.entity';
import { Organization } from './organization.entity';

@Entity('warehouses')
@Index(['organizationId', 'code'], { unique: true })
export class Warehouse extends AppBaseEntity {
  @Column({ name: 'organization_id', type: 'char', length: 36 })
  organizationId: string;

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ length: 50 })
  code: string;

  @Column({ length: 150 })
  name: string;

  @Column({ type: 'enum', enum: WarehouseType, default: WarehouseType.MAIN })
  type: WarehouseType;

  @Column({ length: 255, nullable: true })
  address?: string;

  @Column({ name: 'manager_name', length: 120, nullable: true })
  managerName?: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
