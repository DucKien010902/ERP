'use client';

import { ReadOnlyListPage } from '@/components/pages/read-only-list-page';
import { api } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate, formatNumber } from '@/lib/format';

export default function InventoryLedgerPage() {
  return (
    <ReadOnlyListPage
      eyebrow="Inventory"
      title="Sổ kho / ledger"
      description="Danh sách phát sinh gần nhất từ các chứng từ đã post, là nguồn sự thật cho báo cáo biến động vật tư."
      loader={api.inventory.ledger}
      readPermission="inventory.read"
      searchKeys={['movementType', 'material.name', 'warehouse.name', 'project.name', 'document.documentNo']}
      columns={[
        { label: 'Ngày', key: 'movementDate', render: (row) => formatDate(row.movementDate) },
        { label: 'Chứng từ', key: 'document', render: (row) => row.document?.documentNo || '—' },
        { label: 'Loại', key: 'movementType', render: (row) => <Badge tone={row.direction === 'IN' ? 'emerald' : 'amber'}>{row.movementType}</Badge> },
        { label: 'Vật tư', key: 'material', render: (row) => row.material?.name || '—' },
        { label: 'Kho', key: 'warehouse', render: (row) => row.warehouse?.name || '—' },
        { label: 'IN / OUT', key: 'qty', render: (row) => `${formatNumber(row.qtyIn, 3)} / ${formatNumber(row.qtyOut, 3)}` },
        { label: 'Giá trị', key: 'totalCost', render: (row) => formatCurrency(row.totalCost || 0) },
      ]}
      statsBuilder={(items) => [
        { icon: 'history', tone: 'teal', label: 'Bút toán gần nhất', value: items.length },
        { icon: 'swap', tone: 'emerald', label: 'Phát sinh nhập', value: items.filter((item) => Number(item.qtyIn) > 0).length },
        { icon: 'swap', tone: 'amber', label: 'Phát sinh xuất', value: items.filter((item) => Number(item.qtyOut) > 0).length },
      ]}
    />
  );
}
