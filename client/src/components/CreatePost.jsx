import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const post = {
      title: title,
      content: content,
      image: image,
    };

    axios.post('http://localhost:8000/api/blogpost/create', post, { withCredentials: true })
      .then(res => console.log(res.data))
      .catch(err => console.log(err));

    setTitle('');
    setContent('');
    setImage('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="title" className="form-label">Title:</label>
        <input type="text" className="form-control" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      
      <div className="mb-3">
        <label htmlFor="content" className="form-label">Content:</label>
        <textarea className="form-control" id="content" value={content} onChange={(e) => setContent(e.target.value)} required />
      </div>

      <div className="mb-3">
        <label htmlFor="image" className="form-label">Image URL:</label>
        <input type="text" className="form-control" id="image" value={image} onChange={(e) => setImage(e.target.value)} />
      </div>

      <button type="submit" className="btn btn-primary">Create Post</button>
    </form>
  );
};

export default CreatePost;

