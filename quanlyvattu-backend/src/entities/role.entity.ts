import { Column, Entity, Index, JoinTable, ManyToMany } from 'typeorm';
import { AppBaseEntity } from './base.entity';
import { Permission } from './permission.entity';
import { User } from './user.entity';

@Entity('roles')
@Index(['code'], { unique: true })
export class Role extends AppBaseEntity {
  @Column({ length: 80 })
  code: string;

  @Column({ length: 120 })
  name: string;

  @Column({ length: 255, nullable: true })
  description?: string;

  @Column({ name: 'is_system', default: true })
  isSystem: boolean;

  @ManyToMany(() => Permission, (permission) => permission.roles, { eager: true })
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: Permission[];

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
