import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PostProvider } from './context/PostContext';
import Layout from './components/Layout';
import PostList from './components/PostList';
import PostView from './components/PostView';
import PostForm from './components/PostForm';

function App() {
  return (
    <PostProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/posts/:id" element={<PostView />} />
            <Route path="/create" element={<PostForm />} />
            <Route path="/edit/:id" element={<PostForm />} />
            <Route path="/create" element={<ProtectedRoute><PostForm/></ProtectedRoute>} />
          </Routes>
        </Layout>
      </Router>
    </PostProvider>
  );
}

export default App;
