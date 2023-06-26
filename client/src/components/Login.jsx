
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button } from 'react-bootstrap';
import '../styles/LoginStyles.css';
import loginImage from '../images/login.jpg';
import Logo from '../images/logo_new.png';




function Login({ setIsLoggedIn, setUser }) {  // 

  const navigate = useNavigate();
  const [loginState, setLoginState] = useState({ email: '', password: '' });
  const [loginMessage, setLoginMessage] = useState('');

  const login = (event) => {
    event.preventDefault();
    axios.post('http://localhost:8000/api/login', loginState, { withCredentials: true })
      .then(response => {
        const user = response.data.user;
        console.log(user)
        // const token = response.data.token;

        // localStorage.setItem('user', JSON.stringify(response.data.user));
        // localStorage.setItem('token', response.data.token);

        setIsLoggedIn(true);
        setUser(user);

        setLoginMessage(response.data.msg);
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      })
      .catch(err => {
        console.error(err);
        if (err.response && err.response.data) {
          setLoginMessage(err.response.data.msg);
        }
      });
  }

  return (
    <Container className="login-container">
      <div className="card login-card">
        <div className="row no-gutters">
          <div className="col-md-5">
            <img src={loginImage} alt="login" className="login-card-img" />
          </div>
          <div className="col-md-7">
            <div className="card-body">
              <div className="brand-wrapper">
                <img src={Logo}alt="logo" className="logo" />
              </div>
              <p className="login-card-description">Sign into your account</p>
              <Form onSubmit={login}>
                <div className="form-group">
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="form-control"
                    placeholder="Email address"
                    required
                    value={loginState.email}
                    onChange={(e) => setLoginState({ ...loginState, email: e.target.value })}
                  />
                </div>
                <div className="form-group mb-4">
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className="form-control"
                    placeholder="***********"
                    required
                    value={loginState.password}
                    onChange={(e) => setLoginState({ ...loginState, password: e.target.value })}
                  />
                </div>
                {loginMessage && <p className="login-message">{loginMessage}</p>}
                <Button type="submit" variant="primary" className="btn btn-block login-btn mb-4">Login</Button>
              </Form>
              <p className="login-card-footer-text">Don't have an account? <a href="/register" className="text-reset">Register here</a></p>
              <nav className="login-card-footer-nav">
                <a href="#!">Terms of use.</a>
                <a href="#!">Privacy policy</a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Login;