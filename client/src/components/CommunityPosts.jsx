import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Comment from './Comment';
import CommentForm from './CommentForm';
// import './CommunityPostsStyles.css'; // Import your custom CSS styles for Bootstrap

const CommunityPosts = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [newPost, setNewPost] = useState({ title: '', content: '', author: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/communitypost', { withCredentials: true })
      .then(response => {
        setPosts(response.data);
        response.data.forEach(post => {
          axios.get(`http://localhost:8000/api/post/${post._id}/comments`)
            .then(response => {
              setComments(oldComments => ({
                ...oldComments,
                [post._id]: response.data,
              }));
            })
            .catch(e => {
              console.log('Failed to retrieve comments for post:', post._id);
            });
        });
      })
      .catch(e => {
        console.log('Failed to retrieve posts');
      });
  }, []);

  const postComment = (postId, comment) => {
    axios.post(`http://localhost:8000/api/post/${postId}/comment`, comment, { withCredentials: true })
      .then(response => {
        // After posting a comment, immediately refresh the comments
        refreshComments(postId);
      })
      .catch(e => {
        console.log('Failed to post comment');
      });
  };
  
  

  const refreshComments = postId => {
    axios.get(`http://localhost:8000/api/post/${postId}/comments`)
      .then(res => {
        setComments(oldComments => ({
          ...oldComments,
          [postId]: res.data,
        }));
      })
      .catch(err => console.log(err));
  };

  const createPost = () => {
    axios.post('http://localhost:8000/api/communitypost/create', newPost, { withCredentials: true })
      .then(response => {
        console.log('Post created:', response.data);
        setPosts([...posts, response.data]);
        setNewPost({ title: '', content: '', author: '' });
        setError(null);
      })
      .catch(e => {
        setError('Failed to create post');
      });
  };

  const updatePost = () => {
    axios.put(`http://localhost:8000/api/communitypost/${editingPost._id}`, editingPost, { withCredentials: true })
      .then(response => {
        setPosts(posts.map(post => (post._id === editingPost._id ? response.data : post)));
        setError(null);
        setEditingPost(null);
      })
      .catch(e => {
        setError('Failed to update post');
      });
  };

  const deletePost = id => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      axios
        .delete(`http://localhost:8000/api/communitypost/${id}`, { withCredentials: true })
        .then(response => {
          setPosts(posts.filter(post => post._id !== id));
          setError(null);
        })
        .catch(e => {
          setError('Failed to delete post');
        });
    }
  };



  return (
    <Container>
      <h3 className="text-center mb-4">Welcome to our Community</h3>

      {error && <p className="text-danger">{error}</p>}

      {editingPost ? (
        <Card className="mb-4">
          <Card.Body >
            <Form.Group className="mb-2">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={editingPost.title}
                onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                type="text"
                placeholder="Enter title"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label >Share what's on your mind</Form.Label>
              <Form.Control
                value={editingPost.content}
                onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                as="textarea"
                rows={4}
                placeholder="Enter content"
              />
            </Form.Group >
          </Card.Body >
          <Card.Footer className="d-flex justify-content-end">
            <Button variant="success" onClick={updatePost} className="me-2">
              Update Post
            </Button>
            <Button variant="danger" onClick={() => setEditingPost(null)}>
              Cancel
            </Button>
          </Card.Footer>
        </Card>
      ) : (
        <Card className="mb-4">
          <Card.Body>
            <Form.Group className="mb-2">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                type="text"
                placeholder="Enter title"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Share what's on your mind</Form.Label>
              <Form.Control
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                as="textarea"
                rows={4}
                placeholder="Enter content"
              />
            </Form.Group>
          </Card.Body>
          <Card.Footer className="d-flex justify-content-end">
            <Button variant="primary" onClick={createPost}>
              Create Post
            </Button>
          </Card.Footer>
        </Card>
      )}

      {posts.map(post => (
        <Card key={post._id} className="mb-4">
          <Card.Body>
            <Card.Subtitle className="text-secondary mb-2">Author: {post.author}</Card.Subtitle>
            <Card.Title as="h4" className="mb-2">{post.title}</Card.Title>
            <Card.Text className="mb-2">{post.content}</Card.Text>
          </Card.Body>
          <Card.Footer className="d-flex justify-content-end">
            <Button variant="info" className="me-2" onClick={() => setEditingPost(post)}>
              <FontAwesomeIcon icon={faEdit} />
            </Button>
            <Button variant="danger" onClick={() => deletePost(post._id)}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </Card.Footer>
          <div className="comments-container">
          {comments[post._id] && Array.isArray(comments[post._id]) &&
  comments[post._id].map(comment => (
                <Comment comment={comment} key={comment._id} refreshComments={() => refreshComments(post._id)} className="mb-2" />
              ))}
          </div>
          <CommentForm key={`CommentForm-${post._id}`} postId={post._id} postComment={postComment} postType="CommunityPost" />

        </Card>
      ))}
    </Container>
  );
};

export default CommunityPosts;
