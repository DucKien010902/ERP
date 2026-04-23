import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AuditAction } from '../common/enums';
import { AppBaseEntity } from './base.entity';
import { Organization } from './organization.entity';
import { User } from './user.entity';

@Entity('audit_logs')
@Index(['organizationId', 'module', 'createdAt'])
export class AuditLog extends AppBaseEntity {
  @Column({ name: 'organization_id', type: 'char', length: 36 })
  organizationId: string;

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ name: 'user_id', type: 'char', length: 36, nullable: true })
  userId?: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ type: 'enum', enum: AuditAction })
  action: AuditAction;

  @Column({ length: 80 })
  module: string;

  @Column({ name: 'entity_id', type: 'char', length: 36, nullable: true })
  entityId?: string;

  @Column({ length: 45, nullable: true })
  ip?: string;

  @Column({ name: 'user_agent', length: 255, nullable: true })
  userAgent?: string;

  @Column({ name: 'old_values', type: 'simple-json', nullable: true })
  oldValues?: Record<string, any>;

  @Column({ name: 'new_values', type: 'simple-json', nullable: true })
  newValues?: Record<string, any>;
}
