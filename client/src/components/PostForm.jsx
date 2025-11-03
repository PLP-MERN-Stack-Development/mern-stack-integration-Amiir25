import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePosts } from '../context/PostContext';
import { validatePost } from '../utils/validation';
import * as api from '../services/api';

export default function PostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories, addPost, updatePost, loading } = usePosts();

  const [form, setForm] = useState({
    title: '',
    content: '',
    author: '',
    category: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch existing post data when editing
  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const { data } = await api.getPost(id);
          setForm({
            title: data.title,
            content: data.content,
            author: data.author,
            category: data.category?._id || ''
          });
        } catch (err) {
          console.error('Failed to fetch post:', err);
        }
      })();
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: '' }); // clear error
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validatePost(form);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      if (id) {
        await updatePost(id, form);
      } else {
        await addPost(form);
      }
      navigate('/');
    } catch (err) {
      console.error('Failed to submit post:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{id ? 'Edit Post' : 'Create Post'}</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            style={styles.input}
            placeholder="Enter post title"
          />
          {formErrors.title && <p style={styles.error}>{formErrors.title}</p>}
        </div>

        <div style={styles.field}>
          <label>Content</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            style={styles.textarea}
            placeholder="Write your post content..."
          />
          {formErrors.content && <p style={styles.error}>{formErrors.content}</p>}
        </div>

        <div style={styles.field}>
          <label>Author</label>
          <input
            type="text"
            name="author"
            value={form.author}
            onChange={handleChange}
            style={styles.input}
            placeholder="Author name"
          />
          {formErrors.author && <p style={styles.error}>{formErrors.author}</p>}
        </div>

        <div style={styles.field}>
          <label>Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="">Select a category</option>
            {categories?.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {formErrors.category && <p style={styles.error}>{formErrors.category}</p>}
        </div>

        <button
          type="submit"
          style={styles.button}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : id ? 'Update Post' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '2rem auto',
    padding: '2rem',
    background: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
  },
  title: {
    textAlign: 'center',
    marginBottom: '1.5rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  field: {
    display: 'flex',
    flexDirection: 'column'
  },
  input: {
    padding: '0.5rem',
    borderRadius: '5px',
    border: '1px solid #ccc'
  },
  textarea: {
    padding: '0.5rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
    minHeight: '120px'
  },
  select: {
    padding: '0.5rem',
    borderRadius: '5px',
    border: '1px solid #ccc'
  },
  button: {
    padding: '0.75rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  error: {
    color: 'red',
    fontSize: '0.9rem'
  }
};
