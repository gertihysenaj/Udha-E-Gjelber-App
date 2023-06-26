import { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';  
import NavBar from './components/NavBar'; 
import CreatePost from './components/CreatePost';
import BlogPosts from './components/BlogPosts';
import LogoutButton from './components/LogoutButton';
import CommunityPosts from './components/CommunityPosts'

axios.defaults.withCredentials = true;


function PrivateRoute({children}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8000/api/verify', { withCredentials: true })
      .then(res => {
        setIsAuthorized(res.data.isLoggedIn);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>
  } else {
    return isAuthorized ? children : <Navigate to="/login" replace />
  }
}



function AdminRoute({children}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8000/api/verify', { withCredentials: true })
      .then(res => {
        setIsAuthorized(res.data.isLoggedIn && res.data.user.isAdmin);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>
  } else {
    return isAuthorized ? children : <Navigate to="/dashboard" replace />
  }
}



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const checkAuth = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/verify', { withCredentials: true });
      if (res.data.isLoggedIn) {
        setUser(res.data.user);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);


  // Handle i buttonit Log out
  const handleLogout = async () => {

    try {
      const res = await axios.post('http://localhost:8000/api/logout', {}, { withCredentials: true });
      
      if (res.status === 200) {
        setIsLoggedIn(false);
        setUser(null);
  
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <BrowserRouter>
      <NavBar isLoggedIn={isLoggedIn} user={user} handleLogout={handleLogout} setIsLoggedIn={setIsLoggedIn} setUser={setUser}  />
      <Routes>
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/createpost" element={<AdminRoute><CreatePost /></AdminRoute>} />  
        <Route path="/blog" element={<BlogPosts />} />
        <Route path="/community" element={<PrivateRoute><CommunityPosts /></PrivateRoute>} />
        <Route path="/logout" element={<LogoutButton handleLogout={handleLogout} user={user} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;











