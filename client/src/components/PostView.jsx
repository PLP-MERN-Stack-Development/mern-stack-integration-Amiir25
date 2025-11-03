// inside PostView component after fetching post
import * as api from '../services/api';
import Comments from './Comments';
import { useAuth } from '../context/AuthContext';

const { user } = useAuth();

const handleLike = async () => {
  try {
    await api.likePost(post._id);
    // re-fetch or optimistically update
    const { data } = await api.getPost(post._id);
    setPost(data);
  } catch (err) { console.error(err); }
};

return (
  <div>
    <h1>{post.title}</h1>
    {post.image && <img src={post.image} alt="" style={{maxWidth:400}}/>}
    <p>{post.content}</p>
    <div>
      <button onClick={handleLike}>{post.likes?.length || 0} Like</button>
    </div>
    <Comments postId={post._id}/>
  </div>
);
