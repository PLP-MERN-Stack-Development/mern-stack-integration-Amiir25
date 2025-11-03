import { useEffect, useState } from 'react';
import * as api from '../services/api';
import { Link } from 'react-router-dom';

export default function PostList(){
  const [posts, setPosts] = useState([]);
  const [meta, setMeta] = useState({ page:1, pages:1, total:0, limit:10 });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  const fetch = async (page=1) => {
    setLoading(true);
    try {
      const res = await api.getPosts({ page, limit: meta.limit, search, category });
      setPosts(res.data.data);
      setMeta(res.data.meta);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    (async () => {
      try {
        const catRes = await api.getCategories();
        setCategories(catRes.data);
      } catch (err) { console.error(err); }
    })();
    fetch(1);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const t = setTimeout(()=> fetch(1), 350); // debounced search
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [search, category]);

  if (loading) return <p>Loading posts...</p>;

  return (
    <div>
      <div style={{display:'flex',gap:8,marginBottom:12}}>
        <input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} />
        <select value={category} onChange={e=>setCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map(c=><option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </div>

      <ul>
        {posts.map(p => (
          <li key={p._id} style={{marginBottom:12}}>
            <Link to={`/posts/${p._id}`}><strong>{p.title}</strong></Link>
            <div>Category: {p.category?.name}</div>
            {p.image && <img src={p.image} alt="" style={{maxWidth:150, marginTop:6}}/>}
          </li>
        ))}
      </ul>

      <div style={{display:'flex',gap:8, marginTop:12}}>
        <button disabled={meta.page<=1} onClick={()=>fetch(meta.page-1)}>Prev</button>
        <div>Page {meta.page} / {meta.pages}</div>
        <button disabled={meta.page>=meta.pages} onClick={()=>fetch(meta.page+1)}>Next</button>
      </div>
    </div>
  );
}
