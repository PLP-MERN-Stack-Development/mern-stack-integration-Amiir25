import { useEffect, useState } from 'react';
import { api } from '../api';

export default function ItemList() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await api.get('/items');
    setItems(res.data);
  };

  const addItem = async () => {
    if (!name) return;
    await api.post('/items', { name });
    setName('');
    fetchItems();
  };

  return (
    <div>
      <h1>Items</h1>
      <input 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        placeholder="New item"
      />
      <button onClick={addItem}>Add</button>
      <ul>
        {items.map(item => <li key={item._id}>{item.name} - {item.quantity}</li>)}
      </ul>
    </div>
  );
}
