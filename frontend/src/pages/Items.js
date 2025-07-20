import React, { useEffect } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';

function Items() {
  const { items, fetchItems } = useData();

  useEffect(() => {
    // We use AbortController to create a signal that can cancel the fetch request if the component unmounts.
    // This prevents setItems from being called after the component is unmounted, avoiding a memory leak.
    const controller = new AbortController();
    fetchItems(controller.signal).catch(console.error);
    return () => {
      // When the component unmounts, abort the fetch request.
      controller.abort();
    };
  }, [fetchItems]);

  if (!items.length) return <p>Loading...</p>;

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <Link to={'/items/' + item.id}>{item.name}</Link>
        </li>
      ))}
    </ul>
  );
}

export default Items;