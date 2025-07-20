/*
  CHANGES MADE:
  - fetchItems now accepts dynamic parameters for search (q), pagination (limit, page), and abort signal.
  - The URL for fetching items is built using these parameters, allowing the frontend to request filtered and paginated data from the backend.
  - This enables the UI to support search and pagination controls, and to fetch only the relevant data for each page/search.
*/
import React, { createContext, useCallback, useContext, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);

  // fetchItems accepts search and pagination parameters
  const fetchItems = useCallback(async ({ signal, q = '', limit = 500, page = 1 } = {}) => {
    try {
      const params = new URLSearchParams();
      if (q) params.append('q', q);
      if (limit) params.append('limit', limit);
      // Adds pagination (offset)
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