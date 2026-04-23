import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { MaterialRequestStatus } from '../common/enums';
import { AppBaseEntity } from './base.entity';
import { MaterialRequestItem } from './material-request-item.entity';
import { Organization } from './organization.entity';
import { Project } from './project.entity';
import { User } from './user.entity';
import { Warehouse } from './warehouse.entity';

@Entity('material_requests')
@Index(['organizationId', 'requestNo'], { unique: true })
export class MaterialRequest extends AppBaseEntity {
  @Column({ name: 'organization_id', type: 'char', length: 36 })
  organizationId: string;

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ name: 'request_no', length: 50 })
  requestNo: string;

  @Column({ name: 'project_id', type: 'char', length: 36 })
  projectId: string;

  @ManyToOne(() => Project, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ name: 'warehouse_id', type: 'char', length: 36, nullable: true })
  warehouseId?: string;

  @ManyToOne(() => Warehouse, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse?: Warehouse;

  @Column({ name: 'requester_id', type: 'char', length: 36 })
  requesterId: string;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'requester_id' })
  requester: User;

  @Column({ name: 'approver_id', type: 'char', length: 36, nullable: true })
  approverId?: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'approver_id' })
  approver?: User;

  @Column({ name: 'needed_date', type: 'date', nullable: true })
  neededDate?: string;

  @Column({ type: 'enum', enum: MaterialRequestStatus, default: MaterialRequestStatus.DRAFT })
  status: MaterialRequestStatus;

  @Column({ type: 'text', nullable: true })
  purpose?: string;

  @OneToMany(() => MaterialRequestItem, (item) => item.request, { cascade: true, eager: true })
  items: MaterialRequestItem[];
}
