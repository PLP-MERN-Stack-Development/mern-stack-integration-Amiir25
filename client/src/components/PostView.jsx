import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as api from '../services/api';
import Comments from './Comments';
import { useAuth } from '../context/AuthContext';

export default function PostView() {
  const { id } = useParams();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the post by ID
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.getPost(id);
        setPost(data);
      } catch (err) {
        setError('Failed to load post');
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleLike = async () => {
    try {
      await api.likePost(post._id);
      // re-fetch or optimistically update likes
      const { data } = await api.getPost(post._id);
      setPost(data);
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };

  if (loading) return <p>Loading post...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <div style={styles.container}>
      <h1>{post.title}</h1>

      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          style={styles.image}
        />
      )}

      <p>{post.content}</p>

      <div style={styles.meta}>
        <span>Author: {post.author}</span>
        <span> | Category: {post.category?.name}</span>
        <span> | Likes: {post.likes?.length || 0}</span>
      </div>

      {user && (
        <button onClick={handleLike} style={styles.likeButton}>
          ❤️ {post.likes?.length || 0} {post.likes?.includes(user.id) ? 'Unlike' : 'Like'}
        </button>
      )}

      <Comments postId={post._id} />
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '2rem auto',
    background: '#fff',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  image: {
    maxWidth: '100%',
    margin: '1rem 0',
    borderRadius: '8px',
  },
  meta: {
    color: '#666',
    marginBottom: '1rem',
  },
  likeButton: {
    backgroundColor: '#ff4d4d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    marginBottom: '1.5rem',
  },
};

