import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryBalance, StockLedger } from '../../entities';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryBalance)
    private readonly balanceRepository: Repository<InventoryBalance>,
    @InjectRepository(StockLedger)
    private readonly ledgerRepository: Repository<StockLedger>,
  ) {}

  listBalances(organizationId: string) {
    return this.balanceRepository.find({
      where: { organizationId },
      relations: { material: { category: true, unit: true }, warehouse: true },
      order: { updatedAt: 'DESC' },
    });
  }

  listLedger(organizationId: string) {
    return this.ledgerRepository.find({
      where: { organizationId },
      relations: { material: { unit: true }, warehouse: true, project: true, document: true },
      order: { movementDate: 'DESC' },
      take: 200,
    });
  }

  async lowStock(organizationId: string) {
    const balances = await this.balanceRepository.find({
      where: { organizationId },
      relations: { material: { unit: true, category: true }, warehouse: true },
    });

    return balances.filter((balance) => Number(balance.onHandQty) <= Number(balance.material?.minStock || 0));
  }

  async valuation(organizationId: string) {
    const balances = await this.balanceRepository.find({ where: { organizationId } });
    const totalValue = balances.reduce(
      (sum, balance) => sum + Number(balance.onHandQty || 0) * Number(balance.averageCost || 0),
      0,
    );
    const totalQty = balances.reduce((sum, balance) => sum + Number(balance.onHandQty || 0), 0);

    return {
      totalValue: Number(totalValue.toFixed(2)),
      totalQty: Number(totalQty.toFixed(3)),
      skuCount: balances.length,
    };
  }
}
