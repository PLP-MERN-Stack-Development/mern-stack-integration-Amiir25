import { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { PostContext } from '../context/PostContext';

export default function PostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories } = useContext(PostContext);
  
  const [form, setForm] = useState({ title: '', content: '', category: '', author: '' });

  useEffect(() => {
    if (id) {
      axios.get(`/api/posts/${id}`).then(res => setForm({
        title: res.data.title,
        content: res.data.content,
        category: res.data.category?._id || '',
        author: res.data.author
      }));
    }
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (id) {
      await axios.put(`/api/posts/${id}`, form);
    } else {
      await axios.post('/api/posts', form);
    }
    navigate('/');
  };

  return (
    <div>
      <h1>{id ? 'Edit Post' : 'Create Post'}</h1>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <textarea name="content" placeholder="Content" value={form.content} onChange={handleChange} required />
        <input name="author" placeholder="Author" value={form.author} onChange={handleChange} required />
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">Select Category</option>
          {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
        </select>
        <button type="submit">{id ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
}
