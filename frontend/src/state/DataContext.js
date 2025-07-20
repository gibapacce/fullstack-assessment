import React, { createContext, useCallback, useContext, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);

  // fetchItems now accepts an optional AbortSignal to allow request cancellation.
  // This prevents memory leaks by ensuring setItems is not called if the component unmounts before the fetch completes.
  // If the fetch is aborted (e.g., due to component unmount), we catch the AbortError and simply return without updating state.
  const fetchItems = useCallback(async (signal) => {
    try {
      const res = await fetch('http://localhost:4001/api/items?limit=500', { signal });
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