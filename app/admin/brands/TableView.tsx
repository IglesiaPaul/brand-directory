// app/admin/brands/TableView.tsx
'use client';

import AdminTable from '../table';
import type { Brand } from './types';

export default function TableView({ rows }: { rows: Brand[] }) {
  return <AdminTable initialRows={rows} />;
}
