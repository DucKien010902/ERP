import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission, Role } from '../../entities';
import { AccessController } from './access.controller';
import { AccessService } from './access.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission])],
  providers: [AccessService],
  controllers: [AccessController],
  exports: [AccessService],
})
export class AccessModule {}
