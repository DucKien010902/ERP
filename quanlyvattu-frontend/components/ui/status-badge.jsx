import { Badge } from './badge';
import { AUDIT_ACTION_META, PROJECT_STATUS_META, STATUS_META, WAREHOUSE_TYPE_META } from '@/lib/constants';

export function StatusBadge({ status, map = STATUS_META }) {
  const meta = map[status] || { label: status || '—', tone: 'slate' };
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
}

export function ProjectStatusBadge({ status }) {
  return <StatusBadge status={status} map={PROJECT_STATUS_META} />;
}

export function WarehouseTypeBadge({ status }) {
  return <StatusBadge status={status} map={WAREHOUSE_TYPE_META} />;
}

export function AuditActionBadge({ status }) {
  return <StatusBadge status={status} map={AUDIT_ACTION_META} />;
}
