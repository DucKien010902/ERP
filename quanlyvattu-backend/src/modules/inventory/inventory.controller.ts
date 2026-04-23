import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { InventoryService } from './inventory.service';

@ApiTags('Inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('balances')
  @Permissions('inventory.read')
  listBalances(@Req() req: any) {
    return this.inventoryService.listBalances(req.user.organizationId);
  }

  @Get('ledger')
  @Permissions('inventory.read')
  listLedger(@Req() req: any) {
    return this.inventoryService.listLedger(req.user.organizationId);
  }

  @Get('low-stock')
  @Permissions('inventory.read')
  lowStock(@Req() req: any) {
    return this.inventoryService.lowStock(req.user.organizationId);
  }

  @Get('valuation')
  @Permissions('inventory.read')
  valuation(@Req() req: any) {
    return this.inventoryService.valuation(req.user.organizationId);
  }
}
