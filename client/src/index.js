import React from 'react';
import ReactDOM from 'react-dom';
import { Container } from 'react-bootstrap';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './styles/PageContainer.css'; // Import the CSS file
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

ReactDOM.render(
  <div className="page-container"> 
    <Container>
      <App />
    </Container>
  </div>,
  document.getElementById('root')
);

reportWebVitals();