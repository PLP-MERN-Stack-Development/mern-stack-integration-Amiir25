import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ padding: '1rem', background: '#eee' }}>
      <Link to="/" style={{ marginRight: '1rem' }}>Posts</Link>
      <Link to="/create">Create Post</Link>
    </nav>
  );
}
