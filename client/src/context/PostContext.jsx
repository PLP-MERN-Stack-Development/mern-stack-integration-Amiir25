import { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api';

const PostContext = createContext();

export const usePosts = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch posts & categories
  const fetchData = async () => {
    setLoading(true);
    try {
      const [postRes, catRes] = await Promise.all([api.getPosts(), api.getCategories()]);
      setPosts(postRes.data);
      setCategories(catRes.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Optimistic create post
  const addPost = async (postData) => {
    const tempId = Date.now().toString();
    const optimisticPost = { ...postData, _id: tempId };
    setPosts(prev => [optimisticPost, ...prev]);

    try {
      const res = await api.createPost(postData);
      setPosts(prev => prev.map(p => (p._id === tempId ? res.data : p)));
    } catch (err) {
      setPosts(prev => prev.filter(p => p._id !== tempId));
      setError(err);
    }
  };

  const updatePost = async (id, postData) => {
    const prevPosts = [...posts];
    setPosts(prev => prev.map(p => (p._id === id ? { ...p, ...postData } : p)));

    try {
      await api.updatePost(id, postData);
    } catch (err) {
      setPosts(prevPosts);
      setError(err);
    }
  };

  const removePost = async (id) => {
    const prevPosts = [...posts];
    setPosts(prev => prev.filter(p => p._id !== id));

    try {
      await api.deletePost(id);
    } catch (err) {
      setPosts(prevPosts);
      setError(err);
    }
  };

  return (
    <PostContext.Provider value={{
      posts,
      categories,
      loading,
      error,
      fetchData,
      addPost,
      updatePost,
      removePost
    }}>
      {children}
    </PostContext.Provider>
  );
};
