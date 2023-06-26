import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate} from 'react-router-dom';

function LogoutButton({ handleLogout, user }) {
  const navigate = useNavigate();

  const logout = () => {
    handleLogout();
    navigate.push('/');
  };
  
  return (
    <div>
      <p>
        {user && `Logged in as ${user.firstName} ${user.lastName}`}
      </p>
      <Button variant="primary" onClick={logout}>Logout</Button>
    </div>
  );
}

export default LogoutButton;
