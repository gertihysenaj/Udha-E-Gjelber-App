import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, Button, Container, Dropdown, DropdownButton } from 'react-bootstrap';
import Logo from '../images/logo_new.png';
import '../styles/NavBarStyles.css';

function NavBar({ isLoggedIn, user, setIsLoggedIn, setUser }) {
  const navigate = useNavigate();


  const handleLogoutClick = async () => {
    try {
      const res = await axios.post('http://localhost:8000/api/logout', {}, { withCredentials: true });
      if (res.status === 200) {
        setIsLoggedIn(false);
        setUser(null);
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
    }
  };



  return (
    <>
      <Navbar bg="light" variant="light" expand="lg" className="custom-navbar"> 
        <Container>
          <Navbar.Brand as={NavLink} to="/">
            <img src={Logo} alt="Logo" className="logo" />
            <span>Udheto drejt se ardhmes, ne <span className="green-text">"Udhën e gjëlber"</span></span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={NavLink} to="/dashboard">
                Dashboard
              </Nav.Link>
              <Nav.Link as={NavLink} to="/blog">
                Blog
              </Nav.Link>
              <Nav.Link as={NavLink} to="/community">
                Community
              </Nav.Link>
            </Nav>
            {isLoggedIn && user ? (
              <div>
                <DropdownButton title="Profile" variant="outline-success" id="profile-dropdown" >
                  <Dropdown.ItemText>
                    <div>
                      <span>Logged in as </span>
                      <span>
                        {user.firstName} {user.lastName}
                        {user.isAdmin && <span>(Admin)</span>}
                      </span>
                    </div>
                  </Dropdown.ItemText>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogoutClick}>
                    <span>Logout</span>
                  </Dropdown.Item>
                </DropdownButton>
              </div>
            ) : (
              <div>
                <Button as={NavLink} to="/login" variant="dark" >
                  Login
                </Button>
                <Button as={NavLink} to="/register" variant="dark">
                  Register
                </Button>
              </div>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default NavBar;
