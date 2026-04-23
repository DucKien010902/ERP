import { Column, Entity, Index } from 'typeorm';
import { AppBaseEntity } from './base.entity';

@Entity('organizations')
@Index(['code'], { unique: true })
export class Organization extends AppBaseEntity {
  @Column({ length: 50 })
  code: string;

  @Column({ length: 150 })
  name: string;

  @Column({ name: 'tax_code', length: 50, nullable: true })
  taxCode?: string;

  @Column({ length: 255, nullable: true })
  address?: string;

  @Column({ length: 100, nullable: true })
  email?: string;

  @Column({ length: 30, nullable: true })
  phone?: string;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;
}
