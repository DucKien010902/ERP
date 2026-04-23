import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { ProjectStatus } from '../common/enums';
import { AppBaseEntity } from './base.entity';
import { Organization } from './organization.entity';

@Entity('projects')
@Index(['organizationId', 'code'], { unique: true })
export class Project extends AppBaseEntity {
  @Column({ name: 'organization_id', type: 'char', length: 36 })
  organizationId: string;

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ length: 50 })
  code: string;

  @Column({ length: 180 })
  name: string;

  @Column({ length: 255, nullable: true })
  location?: string;

  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.ACTIVE })
  status: ProjectStatus;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate?: string;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate?: string;

  @Column({ name: 'manager_name', length: 120, nullable: true })
  managerName?: string;
}
