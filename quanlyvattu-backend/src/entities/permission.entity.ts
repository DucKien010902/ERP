import { Column, Entity, Index, ManyToMany } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { Role } from './role.entity';

@Entity('permissions')
@Index(['code'], { unique: true })
export class Permission extends AppBaseEntity {
  @Column({ length: 120 })
  code: string;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 80, nullable: true })
  group?: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
