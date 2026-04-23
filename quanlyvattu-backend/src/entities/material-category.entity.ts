import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { Organization } from './organization.entity';

@Entity('material_categories')
@Index(['organizationId', 'code'], { unique: true })
export class MaterialCategory extends AppBaseEntity {
  @Column({ name: 'organization_id', type: 'char', length: 36 })
  organizationId: string;

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ length: 50 })
  code: string;

  @Column({ length: 120 })
  name: string;

  @Column({ name: 'parent_id', type: 'char', length: 36, nullable: true })
  parentId?: string;

  @ManyToOne(() => MaterialCategory, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent?: MaterialCategory;
}
