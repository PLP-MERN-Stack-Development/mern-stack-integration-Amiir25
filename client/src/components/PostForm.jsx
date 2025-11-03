import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePosts } from '../context/PostContext';
import { validatePost } from '../utils/validation';
import * as api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function PostForm(){
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories, addPost, updatePost } = usePosts();
  const { user } = useAuth();

  const [form, setForm] = useState({ title:'', content:'', author:'', category:'', image:'' });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const { data } = await api.getPost(id);
          setForm({
            title: data.title,
            content: data.content,
            author: data.author,
            category: data.category?._id || '',
            image: data.image || ''
          });
        } catch (err) {
          console.error(err);
        }
      })();
    } else {
      // set author to current user if available
      if (user) setForm(f => ({ ...f, author: user.username }));
    }
  }, [id, user]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = e => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validatePost(form);
    if (Object.keys(v).length) { setErrors(v); return; }

    setSubmitting(true);
    try {
      // handle upload first if file present
      if (file) {
        const fd = new FormData();
        fd.append('image', file);
        const res = await api.uploadImage(fd);
        form.image = res.data.path; // e.g. /uploads/filename.jpg
      }

      if (id) {
        await updatePost(id, form);
      } else {
        await addPost(form);
      }
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{maxWidth:600,margin:'2rem auto',padding:20,background:'#fff',borderRadius:8}}>
      <h2>{id ? 'Edit Post' : 'Create Post'}</h2>
      <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:12}}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
        {errors.title && <small style={{color:'red'}}>{errors.title}</small>}

        <textarea name="content" placeholder="Content" value={form.content} onChange={handleChange} />

        <input name="author" placeholder="Author" value={form.author} onChange={handleChange} />

        <select name="category" value={form.category} onChange={handleChange}>
          <option value="">Select category</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>

        <div>
          <label>Featured image</label>
          <input type="file" accept="image/*" onChange={handleFile} />
          {form.image && <div><img src={form.image} alt="featured" style={{maxWidth:200,display:'block',marginTop:8}}/></div>}
        </div>

        <button type="submit" disabled={submitting}>{submitting ? 'Saving...' : (id ? 'Update' : 'Create')}</button>
      </form>
    </div>
  );
}
