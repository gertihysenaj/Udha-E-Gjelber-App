import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button } from 'react-bootstrap';
import '../styles/RegisterStyles.css';
import registerImage from '../images/registerImage.png';
import Logo from '../images/logo_new.png';


function Register() {

  const navigate = useNavigate();
  const [registerState, setRegisterState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [registerMessage, setRegisterMessage] = useState('');

  const register = (event) => {
    event.preventDefault();

    if (registerState.password !== registerState.confirmPassword) {
      setRegisterMessage('Passwords do not match');
      return;
    }
    if (!registerState.firstName || !registerState.lastName || !registerState.email) {
      setRegisterMessage('Please fill out all required fields');
      return;
    }
    if (registerState.password.length < 8) {
      setRegisterMessage('Password should be at least 8 characters long');
      return;
    }

    axios.post('http://localhost:8000/api/register', registerState, { withCredentials: true })
      .then(response => {
        // localStorage.setItem('user', JSON.stringify(response.data.user));
        // localStorage.setItem('token', response.data.token);
        setRegisterMessage('User registered successfully!');

        setTimeout(() => {
          navigate('/home');
        }, 5000);
      })
      .catch(err => {
        console.error(err);
        if (err.response) {
          setRegisterMessage(err.response.data.message);
        }
      });
  }

  return (
    <main className="d-flex align-items-center min-vh-100 py-3 py-md-0">
      <Container>
        <div className="card register-card">
          <div className="row no-gutters">
            <div className="col-md-7">
              <div className="card-body">
                <div className="brand-wrapper">
                  <img src={Logo} alt="logo" className="logo" />
                </div>
                <p className="register-card-description">Register your account</p>
                <Form onSubmit={register}>
                  <div className="form-group">
                    <label htmlFor="firstName" className="sr-only">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      className="form-control"
                      placeholder="First Name"
                      required
                      value={registerState.firstName}
                      onChange={(e) => setRegisterState({ ...registerState, firstName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName" className="sr-only">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      className="form-control"
                      placeholder="Last Name"
                      required
                      value={registerState.lastName}
                      onChange={(e) => setRegisterState({ ...registerState, lastName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email" className="sr-only">Email</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="form-control"
                      placeholder="Email address"
                      required
                      value={registerState.email}
                      onChange={(e) => setRegisterState({ ...registerState, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password" className="sr-only">Password</label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      className="form-control"
                      placeholder="Password"
                      required
                      value={registerState.password}
                      onChange={(e) => setRegisterState({ ...registerState, password: e.target.value })}
                    />
                  </div>
                  <div className="form-group mb-4">
                    <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      className="form-control"
                      placeholder="Confirm Password"
                      required
                      value={registerState.confirmPassword}
                      onChange={(e) => setRegisterState({ ...registerState, confirmPassword: e.target.value })}
                    />
                  </div>
                  <Button type="submit" variant="primary" className="btn btn-block register-btn">Register</Button>
                </Form>
                {registerMessage && <p className="register-message">{registerMessage}</p>}
                <p className="login-card-footer-text">Already have an account? <a href="/login" className="text-reset">Login here</a></p>
                <nav className="login-card-footer-nav">
                  <a href="#!">Terms of use.</a>
                  <a href="#!">Privacy policy</a>
                </nav>
              </div>
            </div>
            <div className="col-md-5">
              <img src={registerImage} alt="register" className="register-card-img" />
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}

export default Register;