
const userController = require('../controllers/User.controller');
const { authenticate } = require('../config/jwt.config');

module.exports = app => {
    app.post('/api/register', userController.register);
    app.post('/api/login', userController.login);
    app.post('/api/logout', userController.logout)
    app.get('/api/users', userController.getAllUsers);


};
