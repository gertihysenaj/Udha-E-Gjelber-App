import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import axios from 'axios';

const Comment = ({ comment, refreshComments }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8000/api/comment/${comment._id}`, { content: editedContent });
      refreshComments();
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/comment/${comment._id}`);
      refreshComments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card className="comment-container m-2 p-1">
      {isEditing ? (
        <Card.Body>
          <textarea
            className="form-control"
            value={editedContent}
            onChange={e => setEditedContent(e.target.value)}
          />
          <Button onClick={handleUpdate}>Save</Button>
        </Card.Body>
      ) : (
        <Card.Body>
          <Card.Title className="author">{comment.author}</Card.Title>
          <Card.Text className="content">{comment.content}</Card.Text>
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
          <Button onClick={handleDelete}>Delete</Button>
        </Card.Body>
      )}
    </Card>
  );
};

export default Comment;

