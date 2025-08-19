// app/admin/brands/AdminBrandsShell.tsx
'use client';

import { useState } from 'react';
import type { Brand } from './types';
import CardView from './CardView';
import TableView from './TableView';

export default function AdminBrandsShell({ initialRows }: { initialRows: Brand[] }) {
  const [view, setView] = useState<'cards' | 'table'>('cards');

  return (
    <div className="container">
      {/* Header with icon toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16
      }}>
        <h1 style={{ margin: 0 }}>Brands</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className={`btn ${view === 'cards' ? 'btn--primary' : ''}`}
            onClick={() => setView('cards')}
            aria-pressed={view === 'cards'}
            title="Card view"
          >
            <span style={{ marginRight: 6 }} role="img" aria-label="Cards">🗃️</span>
            Cards
          </button>
          <button
            className={`btn ${view === 'table' ? 'btn--primary' : ''}`}
            onClick={() => setView('table')}
            aria-pressed={view === 'table'}
            title="Table view"
          >
            <span style={{ marginRight: 6 }} role="img" aria-label="Table">📋</span>
            Table
          </button>
        </div>
      </div>

      {/* Content */}
      {view === 'cards'
        ? <CardView rows={initialRows} />
        : <TableView rows={initialRows} />
      }
    </div>
  );
}
