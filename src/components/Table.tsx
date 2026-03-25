import React, { useState, useMemo, useCallback, useId } from 'react';

export interface ColumnDef<T> {
  key: keyof T | string;
  header: string;
  cell?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  searchable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  minWidth?: string | number;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
}

export type SortDir = 'asc' | 'desc';

export interface TableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: ColumnDef<T>[];
  rowKey: keyof T;
  selectable?: boolean;
  onSelectionChange?: (selected: T[]) => void;
  filters?: FilterGroup[];
  pageSize?: number;
  pageSizeOptions?: number[];
  loading?: boolean;
  emptyMessage?: string;
  caption?: string;
  globalSearch?: boolean;
  globalSearchPlaceholder?: string;
  toolbar?: React.ReactNode;
  onRowClick?: (row: T) => void;
  className?: string;
}

function getCellValue<T>(row: T, key: keyof T | string): string {
  const val = (row as Record<string, unknown>)[key as string];
  if (val == null) return '';
  return String(val).toLowerCase();
}

export function Table<T extends Record<string, unknown>>({
  data,
  columns,
  rowKey,
  selectable = false,
  onSelectionChange,
  filters = [],
  pageSize: initialPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  caption,
  globalSearch = false,
  globalSearchPlaceholder = 'Buscar...',
  toolbar,
  onRowClick,
  className = '',
}: TableProps<T>) {
  const tableId = useId();

  // State
  const [selected, setSelected] = useState<Set<string | number>>(new Set());
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [columnSearches, setColumnSearches] = useState<Record<string, string>>({});
  const [globalQuery, setGlobalQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, Set<string>>>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [showFilters, setShowFilters] = useState(false);

  // Column search handler
  const setColumnSearch = useCallback((key: string, val: string) => {
    setColumnSearches((prev) => ({ ...prev, [key]: val }));
    setPage(1);
  }, []);

  // Toggle filter
  const toggleFilter = useCallback((groupId: string, value: string) => {
    setActiveFilters((prev) => {
      const group = new Set(prev[groupId] ?? []);
      if (group.has(value)) group.delete(value);
      else group.add(value);
      return { ...prev, [groupId]: group };
    });
    setPage(1);
  }, []);

  // Sort
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  };

  // Derived: filtered + sorted data
  const processed = useMemo(() => {
    let rows = [...data];

    // Global search
    if (globalSearch && globalQuery.trim()) {
      const q = globalQuery.toLowerCase();
      rows = rows.filter((row) =>
        columns.some((col) => getCellValue(row, col.key).includes(q))
      );
    }

    // Column searches
    Object.entries(columnSearches).forEach(([key, q]) => {
      if (!q.trim()) return;
      const lq = q.toLowerCase();
      rows = rows.filter((row) => getCellValue(row, key).includes(lq));
    });

    // Checkbox filters
    Object.entries(activeFilters).forEach(([groupId, values]) => {
      if (values.size === 0) return;
      rows = rows.filter((row) => values.has(String((row as Record<string, unknown>)[groupId])));
    });

    // Sort
    if (sortKey) {
      rows.sort((a, b) => {
        const av = getCellValue(a, sortKey);
        const bv = getCellValue(b, sortKey);
        const cmp = av.localeCompare(bv, undefined, { numeric: true });
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }

    return rows;
  }, [data, columns, globalSearch, globalQuery, columnSearches, activeFilters, sortKey, sortDir]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(processed.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = processed.slice((safePage - 1) * pageSize, safePage * pageSize);
  const start = processed.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = Math.min(safePage * pageSize, processed.length);

  // Selection
  const pageKeys = pageRows.map((r) => r[rowKey] as string | number);
  const allPageSelected = pageKeys.length > 0 && pageKeys.every((k) => selected.has(k));
  const somePageSelected = pageKeys.some((k) => selected.has(k)) && !allPageSelected;

  const toggleSelectAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allPageSelected) {
        pageKeys.forEach((k) => next.delete(k));
      } else {
        pageKeys.forEach((k) => next.add(k));
      }
      const selectedRows = data.filter((r) => next.has(r[rowKey] as string | number));
      onSelectionChange?.(selectedRows);
      return next;
    });
  };

  const toggleRow = (key: string | number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      const selectedRows = data.filter((r) => next.has(r[rowKey] as string | number));
      onSelectionChange?.(selectedRows);
      return next;
    });
  };

  // Page numbers for pagination display
  const pageNumbers = useMemo(() => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push('...');
      for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) {
        pages.push(i);
      }
      if (safePage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  }, [totalPages, safePage]);

  const activeFilterCount = Object.values(activeFilters).reduce(
    (acc, s) => acc + s.size,
    0
  );

  return (
    <div className={['ui-table-wrapper', className].filter(Boolean).join(' ')}>
      {/* Toolbar */}
      <div className="ui-table-toolbar">
        {globalSearch && (
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <span
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--ui-text-dim)',
                display: 'flex',
                pointerEvents: 'none',
              }}
              aria-hidden="true"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="6.5" cy="6.5" r="4.5" />
                <path d="M10 10l3.5 3.5" />
              </svg>
            </span>
            <input
              className="ui-control"
              style={{ paddingLeft: 36, minHeight: 38, fontSize: 13 }}
              placeholder={globalSearchPlaceholder}
              value={globalQuery}
              onChange={(e) => { setGlobalQuery(e.target.value); setPage(1); }}
              aria-label={globalSearchPlaceholder}
            />
          </div>
        )}

        {filters.length > 0 && (
          <button
            className={`ui-btn ui-btn-sm ${showFilters ? 'ui-btn-secondary' : 'ui-btn-ghost'}`}
            onClick={() => setShowFilters((s) => !s)}
            aria-pressed={showFilters}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M1 3h12M3 7h8M5 11h4" />
            </svg>
            Filtros
            {activeFilterCount > 0 && (
              <span
                style={{
                  background: 'var(--ui-accent)',
                  color: '#0e0c0a',
                  borderRadius: 99,
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '1px 6px',
                  minWidth: 18,
                  textAlign: 'center',
                }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>
        )}

        {selected.size > 0 && (
          <span style={{ fontSize: 12, color: 'var(--ui-accent)', fontWeight: 500 }}>
            {selected.size} {selected.size === 1 ? 'fila seleccionada' : 'filas seleccionadas'}
          </span>
        )}

        {toolbar && <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>{toolbar}</div>}
      </div>

      {/* Filters panel */}
      {showFilters && filters.length > 0 && (
        <div
          style={{
            padding: '14px 18px',
            borderBottom: '1px solid var(--ui-border)',
            display: 'flex',
            gap: 24,
            flexWrap: 'wrap',
            background: 'var(--ui-elevated)',
          }}
        >
          {filters.map((group) => (
            <div key={group.id}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--ui-text-dim)',
                  marginBottom: 8,
                }}
              >
                {group.label}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {group.options.map((opt) => {
                  const checked = (activeFilters[group.id] ?? new Set()).has(opt.value);
                  return (
                    <label key={opt.value} className="ui-checkbox" htmlFor={`${tableId}-${group.id}-${opt.value}`}>
                      <input
                        type="checkbox"
                        id={`${tableId}-${group.id}-${opt.value}`}
                        checked={checked}
                        onChange={() => toggleFilter(group.id, opt.value)}
                      />
                      <span className="ui-checkbox-box">
                        <svg className="ui-checkbox-mark" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M1.5 5l2.5 2.5 4.5-4.5" />
                        </svg>
                      </span>
                      <span style={{ fontSize: 13, color: 'var(--ui-text)' }}>{opt.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
          {activeFilterCount > 0 && (
            <button
              className="ui-btn ui-btn-ghost ui-btn-sm"
              style={{ marginTop: 'auto', alignSelf: 'flex-end' }}
              onClick={() => setActiveFilters({})}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="ui-table-container">
        <table className="ui-table" aria-busy={loading}>
          {caption && <caption style={{ display: 'none' }}>{caption}</caption>}
          <thead>
            <tr>
              {selectable && (
                <th style={{ width: 48, paddingRight: 8 }}>
                  <label className="ui-checkbox" aria-label="Seleccionar todos">
                    <input
                      type="checkbox"
                      checked={allPageSelected}
                      ref={(el) => { if (el) el.indeterminate = somePageSelected; }}
                      onChange={toggleSelectAll}
                    />
                    <span className="ui-checkbox-box">
                      <svg className="ui-checkbox-mark" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M1.5 5l2.5 2.5 4.5-4.5" />
                      </svg>
                      <svg className="ui-checkbox-indeterminate" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                        <path d="M2 5h6" />
                      </svg>
                    </span>
                  </label>
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={col.sortable ? 'sortable' : ''}
                  style={{
                    width: col.width,
                    minWidth: col.minWidth,
                    textAlign: col.align ?? 'left',
                  }}
                  aria-sort={
                    sortKey === col.key
                      ? sortDir === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : col.sortable
                      ? 'none'
                      : undefined
                  }
                >
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: col.sortable ? 'pointer' : 'default' }}
                    onClick={col.sortable ? () => handleSort(String(col.key)) : undefined}
                  >
                    {col.header}
                    {col.sortable && (
                      <span style={{ display: 'flex', opacity: sortKey === col.key ? 1 : 0.3 }} aria-hidden="true">
                        {sortKey === col.key && sortDir === 'desc' ? (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 9L2 5h8L6 9z" fill="currentColor" stroke="none" />
                          </svg>
                        ) : (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 3L2 7h8L6 3z" fill="currentColor" stroke="none" />
                          </svg>
                        )}
                      </span>
                    )}
                  </div>
                  {col.searchable && (
                    <input
                      className="ui-table-col-search"
                      placeholder={`Buscar ${col.header.toLowerCase()}...`}
                      value={columnSearches[String(col.key)] ?? ''}
                      onChange={(e) => setColumnSearch(String(col.key), e.target.value)}
                      aria-label={`Filtrar por ${col.header}`}
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <tr key={i} className="ui-table-skel" aria-hidden="true">
                  {selectable && (
                    <td style={{ paddingRight: 8 }}>
                      <span className="ui-skeleton" style={{ width: 17, height: 17, borderRadius: 4, display: 'block' }} />
                    </td>
                  )}
                  {columns.map((col, ci) => {
                    // Deterministic widths — vary by row + col to avoid layout shifts
                    const widths = [75, 90, 55, 80, 65, 70, 85, 60];
                    const w = widths[(i * 3 + ci) % widths.length];
                    // First column often has an avatar+text pattern
                    const isFirst = ci === 0;
                    return (
                      <td key={String(col.key)} style={{ padding: '11px 14px' }}>
                        {isFirst ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span className="ui-skeleton" style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, display: 'block' }} />
                            <span className="ui-skeleton ui-skeleton-text" style={{ width: `${w}%` }} />
                          </div>
                        ) : (
                          <span className="ui-skeleton ui-skeleton-text" style={{ width: `${w}%`, display: 'block' }} />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : pageRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--ui-text-dim)', fontSize: 14 }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }} aria-hidden="true">
                      <rect x="4" y="6" width="24" height="20" rx="2" />
                      <path d="M4 12h24M10 6V4M22 6V4" />
                    </svg>
                    {emptyMessage}
                  </div>
                </td>
              </tr>
            ) : (
              pageRows.map((row, idx) => {
                const key = row[rowKey] as string | number;
                const isRowSelected = selected.has(key);
                return (
                  <tr
                    key={key}
                    className={isRowSelected ? 'row-selected' : ''}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                  >
                    {selectable && (
                      <td style={{ paddingRight: 8 }} onClick={(e) => e.stopPropagation()}>
                        <label className="ui-checkbox" aria-label={`Seleccionar fila ${idx + 1}`}>
                          <input
                            type="checkbox"
                            checked={isRowSelected}
                            onChange={() => toggleRow(key)}
                          />
                          <span className="ui-checkbox-box">
                            <svg className="ui-checkbox-mark" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="M1.5 5l2.5 2.5 4.5-4.5" />
                            </svg>
                          </span>
                        </label>
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={String(col.key)}
                        style={{ textAlign: col.align ?? 'left' }}
                      >
                        {col.cell
                          ? col.cell(row, idx)
                          : String((row as Record<string, unknown>)[col.key as string] ?? '')}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="ui-table-pagination">
        <span>
          {processed.length === 0
            ? 'Sin resultados'
            : `${start}–${end} de ${processed.length} ${processed.length === 1 ? 'fila' : 'filas'}`}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <label style={{ fontSize: 12, color: 'var(--ui-text-dim)' }}>
            Filas:{' '}
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              style={{ background: 'var(--ui-surface)', color: 'var(--ui-text)', border: '1px solid var(--ui-border)', borderRadius: 4, padding: '2px 6px', fontSize: 12, fontFamily: 'inherit', marginLeft: 4 }}
              aria-label="Filas por página"
            >
              {pageSizeOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>

          <div style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
            <button
              className="ui-table-page-btn"
              onClick={() => setPage(1)}
              disabled={safePage === 1}
              aria-label="Primera página"
            >
              «
            </button>
            <button
              className="ui-table-page-btn"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              aria-label="Página anterior"
            >
              ‹
            </button>

            {pageNumbers.map((p, i) =>
              p === '...' ? (
                <span key={`ellipsis-${i}`} style={{ display: 'flex', alignItems: 'center', padding: '0 4px', color: 'var(--ui-text-dim)', fontSize: 12 }}>…</span>
              ) : (
                <button
                  key={p}
                  className={['ui-table-page-btn', p === safePage ? 'active' : ''].join(' ')}
                  onClick={() => setPage(p)}
                  aria-label={`Página ${p}`}
                  aria-current={p === safePage ? 'page' : undefined}
                >
                  {p}
                </button>
              )
            )}

            <button
              className="ui-table-page-btn"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              aria-label="Página siguiente"
            >
              ›
            </button>
            <button
              className="ui-table-page-btn"
              onClick={() => setPage(totalPages)}
              disabled={safePage === totalPages}
              aria-label="Última página"
            >
              »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
