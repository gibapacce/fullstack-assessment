/*
  CHANGES MADE:
  - Added search input and pagination controls (Previous/Next buttons) to the UI.
  - Integrated with the backend to fetch only the items for the current page and search query.
  - Uses react-window (FixedSizeList) for list virtualization, improving performance with large lists.
  - The user can search for items by name and navigate through pages, with only the relevant data loaded per page.
*/
import React, { useEffect, useState, useCallback } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';

function Items() {
  const { items, fetchItems } = useData();
  const [q, setQ] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);
  const limit = 20;

  const loadItems = useCallback((signal) => {
    setLoading(true);
    fetchItems({ signal, q: search, limit, page }).then(() => setLoading(false));
  }, [fetchItems, search, limit, page]);

  useEffect(() => {
    const controller = new AbortController();
    loadItems(controller.signal);
    return () => controller.abort();
  }, [loadItems]);

  useEffect(() => {
    setNoResults(!loading && items.length === 0);
  }, [items, loading]);

  // Skeleton loader
  const Skeleton = () => (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <li key={i} style={{
          background: '#eee',
          height: 36,
          margin: '8px 0',
          borderRadius: 6,
          animation: 'pulse 1.2s infinite',
        }} />
      ))}
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </ul>
  );

  const Row = ({ index, style }) => {
    const item = items[index];
    if (!item) return null;
    return (
      <li style={{
        ...style,
        listStyle: 'none',
        padding: '0 0 0 8px',
        margin: 0,
        borderBottom: '1px solid #eee',
        display: 'flex',
        alignItems: 'center',
        background: index % 2 === 0 ? '#fafbfc' : '#fff',
        fontSize: 16,
        minHeight: 36,
      }}>
        <Link to={'/items/' + item.id} style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 500 }}>
          {item.name}
        </Link>
      </li>
    );
  };

  return (
    <div style={{ maxWidth: 400, margin: '32px auto', fontFamily: 'Segoe UI, Arial, sans-serif' }}>
      <form
        onSubmit={e => {
          e.preventDefault();
          setPage(1);
          setSearch(q);
        }}
        style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: 12 }}
      >
        <input
          type="text"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Buscar..."
          style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc', fontSize: 15 }}
        />
        <button type="submit" style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: '#1976d2', color: '#fff', fontWeight: 500, cursor: 'pointer', fontSize: 15 }}>
          Buscar
        </button>
      </form>
      {loading ? (
        <Skeleton />
      ) : noResults ? (
        <div style={{ color: '#888', textAlign: 'center', margin: '32px 0' }}>Nenhum resultado encontrado.</div>
      ) : (
        <List
          height={240}
          itemCount={items.length}
          itemSize={44}
          width={400}
          outerElementType="ul"
        >
          {Row}
        </List>
      )}
      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 12 }}>
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1 || loading}
          style={{
            padding: '8px 16px',
            borderRadius: 6,
            border: 'none',
            background: page === 1 || loading ? '#eee' : '#1976d2',
            color: page === 1 || loading ? '#aaa' : '#fff',
            fontWeight: 500,
            cursor: page === 1 || loading ? 'not-allowed' : 'pointer',
            fontSize: 15,
            transition: 'background 0.2s',
          }}
        >
          Anterior
        </button>
        <span style={{ alignSelf: 'center', fontSize: 15 }}>Página {page}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={items.length < limit || loading}
          style={{
            padding: '8px 16px',
            borderRadius: 6,
            border: 'none',
            background: items.length < limit || loading ? '#eee' : '#1976d2',
            color: items.length < limit || loading ? '#aaa' : '#fff',
            fontWeight: 500,
            cursor: items.length < limit || loading ? 'not-allowed' : 'pointer',
            fontSize: 15,
            transition: 'background 0.2s',
          }}
        >
          Próxima
        </button>
      </div>
    </div>
  );
}

export default Items;