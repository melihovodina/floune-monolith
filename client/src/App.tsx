import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import Concerts from './pages/Concerts';
import ConcertCreate from './pages/ConcertCreate';
import Orders from './pages/Orders';
import { useAuth } from './store/useAuth';
import { useEffect } from 'react';
import axios from 'axios';
import UploadTrack from './pages/UploadTrack';
import SignUp from './pages/SignUp';
import Track from './pages/Track';
import Admin from './pages/Admin';

function App() {
  const { setAuth } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.post('http://localhost:5000/auth/validate', { token })
      .then(res => {
        if (
          res.data &&
          res.data._id &&
          Array.isArray(res.data.likedTracks) &&
          Array.isArray(res.data.following)
        ) {
          setAuth({
            token,
            _id: res.data._id,
            name: res.data.name,
            role: res.data.role,
            likedTracks: res.data.likedTracks,
            following: res.data.following
          });
        } else {
          setAuth(null);
        }
      })
      .catch(() => {
        setAuth(null);
      });
  }, [setAuth]);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="search" element={<Search />} />
            <Route path="library" element={<Library />} />
            <Route path="track/:id" element={<Track />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/:name" element={<Profile />} />
            <Route path="upload" element={<UploadTrack />} />
            <Route path="concerts" element={<Concerts />} />
            <Route path="concerts/create" element={<ConcertCreate />} />
            <Route path="orders" element={<Orders />} />
            <Route path="admin" element={<Admin />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;