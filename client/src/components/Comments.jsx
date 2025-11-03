import { useEffect, useState } from 'react';
import * as api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Comments({ postId }){
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.getCommentsForPost(postId);
      setComments(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(()=>{ load(); }, [postId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      // optimistic
      const temp = { _id: 'temp-' + Date.now(), content, author: user.username, authorId: user.id, createdAt: new Date() };
      setComments(prev => [temp, ...prev]);
      setContent('');
      const res = await api.createComment({ post: postId, content });
      setComments(prev => prev.map(c => (c._id===temp._id ? res.data : c)));
    } catch (err) {
      console.error(err);
      // rollback: refetch
      load();
    }
  };

  const remove = async (id) => {
    try {
      await api.deleteComment(id);
      setComments(prev => prev.filter(c => c._id !== id));
    } catch (err) { console.error(err); }
  };

  return (
    <div>
      <h4>Comments</h4>
      {user ? (
        <form onSubmit={submit}>
          <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Write a comment..." />
          <button type="submit">Post comment</button>
        </form>
      ) : <p>You must be logged in to comment.</p>}

      {loading ? <p>Loading comments...</p> : comments.map(c => (
        <div key={c._id} style={{borderBottom:'1px solid #eee', padding:'8px 0'}}>
          <div><strong>{c.author}</strong> <small>{new Date(c.createdAt).toLocaleString()}</small></div>
          <div>{c.content}</div>
          {user && (user.username === c.author) && <button onClick={()=>remove(c._id)}>Delete</button>}
        </div>
      ))}
    </div>
  );
}
