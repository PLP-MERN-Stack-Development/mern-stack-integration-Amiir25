import { createContext } from 'react';
import { useApi } from '../hooks/useAPI.js';

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const postApi = useApi('/api/posts');
  const categoryApi = useApi('/api/categories');

  return (
    <PostContext.Provider value={{ ...postApi, categories: categoryApi.data }}>
      {children}
    </PostContext.Provider>
  );
};
