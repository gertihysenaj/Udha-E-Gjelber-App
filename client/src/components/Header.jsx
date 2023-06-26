import React from 'react';
import { Container, Image } from 'react-bootstrap';
// import './HeaderStyles.css'; // Import your custom CSS styles for Bootstrap

const Header = () => {
  return (
    <header className="header">
      <Image src="https://i.ibb.co/pLJJqJD/logo-removebg-preview-2.png" alt="Icon" className="icon" />
      <h2 className="title">
        Miresevini tek Udha e Gjelber
      </h2>
    </header>
  );
};

export default Header;
