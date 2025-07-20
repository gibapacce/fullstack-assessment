import React, { useEffect, useState, useCallback } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';

function Items() {
  const { items, fetchItems } = useData();
  const [q, setQ] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 20;

  // Função para buscar itens com paginação e busca
  const loadItems = useCallback((signal) => {
    fetchItems({ signal, q: search, limit, page });
  }, [fetchItems, search, page]);

  useEffect(() => {
    const controller = new AbortController();
    loadItems(controller.signal);
    return () => controller.abort();
  }, [loadItems]);

  if (!items.length) return <p>Loading...</p>;

  // Row renderer for react-window
  const Row = ({ index, style }) => {
    const item = items[index];
    return (
      <li style={style} key={item.id}>
        <Link to={'/items/' + item.id}>{item.name}</Link>
      </li>
    );
  };

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          setPage(1);
          setSearch(q);
        }}
        style={{ marginBottom: 16 }}
      >
        <input
          type="text"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Buscar..."
        />
        <button type="submit">Buscar</button>
      </form>
      <List
        height={400}
        itemCount={items.length}
        itemSize={40}
        width={300}
        outerElementType="ul"
      >
        {Row}
      </List>
      <div style={{ marginTop: 16 }}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
          Anterior
        </button>
        <span style={{ margin: '0 8px' }}>Página {page}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={items.length < limit}>
          Próxima
        </button>
      </div>
    </div>
  );
}

export default Items;