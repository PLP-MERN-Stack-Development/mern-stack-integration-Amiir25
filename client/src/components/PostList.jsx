import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { PostContext } from '../context/PostContext';

export default function PostList() {
  const { data: posts, loading, error } = useContext(PostContext);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading posts.</p>;

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post._id}>
            <Link to={`/posts/${post._id}`}>{post.title}</Link> | Category: {post.category?.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
