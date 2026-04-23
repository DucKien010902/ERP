import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { Organization } from './organization.entity';

@Entity('suppliers')
@Index(['organizationId', 'code'], { unique: true })
export class Supplier extends AppBaseEntity {
  @Column({ name: 'organization_id', type: 'char', length: 36 })
  organizationId: string;

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ length: 50 })
  code: string;

  @Column({ length: 180 })
  name: string;

  @Column({ name: 'tax_code', length: 50, nullable: true })
  taxCode?: string;

  @Column({ length: 255, nullable: true })
  address?: string;

  @Column({ name: 'contact_name', length: 120, nullable: true })
  contactName?: string;

  @Column({ length: 30, nullable: true })
  phone?: string;

  @Column({ length: 120, nullable: true })
  email?: string;

  @Column({ name: 'payment_terms', length: 120, nullable: true })
  paymentTerms?: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
