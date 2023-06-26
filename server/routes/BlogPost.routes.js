const BlogPostController = require('../controllers/BlogPost.controller');
const verifyAdmin = require('../middlewares').verifyAdmin;



module.exports = function(app){
    app.get('/api/blogpost', BlogPostController.getAllPosts);
    app.get('/api/blogpost/:id', BlogPostController.getPostById);
    app.post('/api/blogpost/create', verifyAdmin, BlogPostController.createPost);
    app.delete('/api/blogpost/:id',verifyAdmin, BlogPostController.deletePost);
    app.put('/api/blogpost/:id', verifyAdmin, BlogPostController.updatePost);
}
