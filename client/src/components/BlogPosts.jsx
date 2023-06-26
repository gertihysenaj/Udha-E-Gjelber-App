import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import './BlogPostsStyles.css';
import Comment from './Comment';
import CommentForm from './CommentForm';


const BlogPosts = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});

  useEffect(() => {
    axios.get('http://localhost:8000/api/blogpost', { withCredentials: true })
      .then(res => {
        setPosts(res.data);
        // Fetch comments for all posts
        const fetchCommentsPromises = res.data.map(post => {
          return axios.get(`http://localhost:8000/api/post/${post._id}/comments`)
            .then(res => {
              return {postId: post._id, comments: res.data};
            })
            .catch(err => console.log(err));
        });
        // When all comments fetching requests are done
        Promise.all(fetchCommentsPromises).then((commentsArray) => {
          const newComments = {};
          commentsArray.forEach((item) => {
            newComments[item.postId] = item.comments;
          });
          setComments(newComments);
        });
      })
      .catch(err => console.log(err));
  }, []);
  

  const postComment = (postId, comment) => {
    console.log('postComment called with postId:', postId, 'and comment:', comment);
    axios.post(`http://localhost:8000/api/post/${postId}/comment`, comment, { withCredentials: true })
      .then(response => {
        // console.log('Successfully posted comment, response data:', response.data);
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




  return (
    <div className="container mt-2">
      {posts.map(post => (
        <div className="block" key={post._id}>
          <div className="card mb-3 ">
            <div className="card-header ">
              <h5 className="card-title">{post.title}</h5>
              <p className="card-subtitle text-muted">
                Author: {post.author} | Date: {new Date(post.date).toLocaleDateString()}
              </p>
            </div>
            <img src={post.image} className="card-img-top" alt={post.title} />
            <div className="card-body">
              <p className="card-text">{post.content}</p>
            </div>
            <div>
              {comments[post._id] && comments[post._id].map(comment => (
                <Comment comment={comment} key={comment._id} refreshComments={() => refreshComments(post._id)} />
              ))}
            </div>
            <CommentForm postId={post._id} postComment={postComment} postType="BlogPost" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default BlogPosts;

