'use client';

import { ReadOnlyListPage } from '@/components/pages/read-only-list-page';
import { api } from '@/lib/api';
import { formatNumber } from '@/lib/format';
import { Badge } from '@/components/ui/badge';

export default function LowStockPage() {
  return (
    <ReadOnlyListPage
      eyebrow="Inventory"
      title="Cảnh báo thiếu hàng"
      description="Những vật tư đã chạm hoặc thấp hơn mức tồn tối thiểu, cần lập kế hoạch mua hoặc điều chuyển kịp thời."
      loader={api.inventory.lowStock}
      readPermission="inventory.read"
      searchKeys={['material.name', 'material.code', 'warehouse.name', 'material.category.name']}
      columns={[
        { label: 'Vật tư', key: 'material', render: (row) => <div><div className="font-semibold text-slate-900">{row.material?.name}</div><div className="text-xs text-slate-500">{row.material?.code}</div></div> },
        { label: 'Nhóm', key: 'category', render: (row) => row.material?.category?.name || '—' },
        { label: 'Kho', key: 'warehouse', render: (row) => row.warehouse?.name || '—' },
        { label: 'Tồn hiện tại', key: 'onHandQty', render: (row) => formatNumber(row.onHandQty, 3) },
        { label: 'Min stock', key: 'minStock', render: (row) => formatNumber(row.material?.minStock, 3) },
        { label: 'Mức cảnh báo', key: 'severity', render: (row) => <Badge tone={Number(row.onHandQty) <= 0 ? 'rose' : 'amber'}>{Number(row.onHandQty) <= 0 ? 'Khẩn cấp' : 'Cần xử lý'}</Badge> },
      ]}
      statsBuilder={(items) => [
        { icon: 'alert', tone: 'amber', label: 'Mã đang thiếu', value: items.length },
        { icon: 'alert', tone: 'rose', label: 'Hết hàng', value: items.filter((item) => Number(item.onHandQty) <= 0).length },
        { icon: 'warehouse', tone: 'blue', label: 'Kho bị ảnh hưởng', value: new Set(items.map((item) => item.warehouseId)).size },
      ]}
    />
  );
}
