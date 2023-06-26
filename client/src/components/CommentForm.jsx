
import React, { useState } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

// import './CommentFormStyles.css'; // Import your custom CSS styles for Bootstrap

const CommentForm = ({ postId, postComment, postType }) => {
  const [content, setContent] = useState('');
  const author = 'Gerti Hysenaj';

              // Decode the JWT from the cookie to get the user's information
    // const jwt = Cookies.get('token');
    // const user = jwt ? jwt_decode(jwt) : null;
    // const author = user ? `${user.firstName} ${user.lastName}` : '';
    // const author = 'User';

    const handleSubmit = (event) => {
      event.preventDefault();
      postComment(postId, { content, author, postType });
      setContent('');
    };
  

  return (
    <Container className="mt-4">
      <Form onSubmit={handleSubmit}>
        <Form.Control
          className="mb-3"
          type="text"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Comment"
        />
        <Button variant="primary" type="submit" className="mb-2 mt-0">
          Submit
        </Button>
      </Form>
    </Container>
  );
};

export default CommentForm;
