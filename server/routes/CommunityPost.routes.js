const CommunityPostController = require('../controllers/CommunityPost.controller');


module.exports = function(app){
    app.get('/api/communitypost', CommunityPostController.getAllPosts);
    app.get('/api/communitypost/:id', CommunityPostController.getPostById);
    app.post('/api/communitypost/create', CommunityPostController.createPost);
    app.delete('/api/communitypost/:id', CommunityPostController.deletePost);
    app.put('/api/communitypost/:id', CommunityPostController.updatePost);
}
