const GreenRouteController = require('../controllers/GreenRoute.controller');

const axios = require('axios');

module.exports = function(app){
  app.post('/api/greenroute', GreenRouteController.createRoute);
  app.get('/api/greenroute/:userId', GreenRouteController.getRoutesByUser);
}
