const CommentController = require('../controllers/Comment.controller');

module.exports = function(app){
  app.post('/api/post/:postId/comment', (req, res) => {
    CommentController.createComment(req, res);
  });
  app.get('/api/post/:postId/comments',  CommentController.getAllCommentsByPostId);
  app.put('/api/comment/:commentId', CommentController.updateComment);
  app.delete('/api/comment/:commentId', CommentController.deleteComment);
}

