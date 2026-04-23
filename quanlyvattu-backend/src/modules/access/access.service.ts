import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Permission, Role } from '../../entities';

@Injectable()
export class AccessService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  listRoles() {
    return this.roleRepository.find({ order: { name: 'ASC' } });
  }

  listPermissions() {
    return this.permissionRepository.find({ order: { group: 'ASC', name: 'ASC' } });
  }

  findRolesByIds(ids: string[]) {
    return this.roleRepository.find({ where: { id: In(ids) } });
  }

  findRolesByCodes(codes: string[]) {
    return this.roleRepository.find({ where: codes.map((code) => ({ code })) });
  }
}
