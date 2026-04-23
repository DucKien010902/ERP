import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { Organization } from './organization.entity';
import { User } from './user.entity';

@Entity('attachments')
export class Attachment extends AppBaseEntity {
  @Column({ name: 'organization_id', type: 'char', length: 36 })
  organizationId: string;

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ length: 80 })
  module: string;

  @Column({ name: 'entity_id', type: 'char', length: 36 })
  entityId: string;

  @Column({ name: 'file_name', length: 255 })
  fileName: string;

  @Column({ name: 'file_url', length: 500 })
  fileUrl: string;

  @Column({ name: 'mime_type', length: 120, nullable: true })
  mimeType?: string;

  @Column({ name: 'file_size', type: 'int', default: 0 })
  fileSize: number;

  @Column({ name: 'uploaded_by_id', type: 'char', length: 36, nullable: true })
  uploadedById?: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'uploaded_by_id' })
  uploadedBy?: User;
}
