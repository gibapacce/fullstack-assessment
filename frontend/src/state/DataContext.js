import React, { createContext, useCallback, useContext, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);

  // fetchItems aceita parâmetros de busca e paginação
  const fetchItems = useCallback(async ({ signal, q = '', limit = 500, page = 1 } = {}) => {
    try {
      const params = new URLSearchParams();
      if (q) params.append('q', q);
      if (limit) params.append('limit', limit);
      // Adiciona paginação (offset)
      if (page && limit) params.append('offset', (page - 1) * limit);
      const url = `http://localhost:4001/api/items?${params.toString()}`;
      const res = await fetch(url, { signal });
      const json = await res.json();
      setItems(json);
    } catch (err) {
      if (err.name === 'AbortError') return; // fetch aborted
      throw err;
    }
  }, []);

  return (
    <DataContext.Provider value={{ items, fetchItems }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);