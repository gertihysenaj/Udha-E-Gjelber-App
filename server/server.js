const express = require('express');
const app = express();
const port = 8000;

const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const axios = require('axios');

const verifyAdmin = require('./middlewares').verifyAdmin;

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());

require('./config/mongoose.config');
require('./routes/User.routes')(app);
require('./routes/GreenRoute.routes')(app);
require('./routes/BlogPost.routes')(app);
require('./routes/Comment.routes')(app);
require('./routes/CommunityPost.routes')(app);

const adminController = require('./controllers/admin.controller');
const BlogPostController = require('./controllers/BlogPost.controller');

const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;




// Verifikime nqs User eshte i authentifikuar cookies-token

app.get('/api/verify', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json({ isLoggedIn: false });

  jwt.verify(token, SECRET, (err, decodedPayload) => {
    if (err) return res.json({ isLoggedIn: false });

    // user is authenticated
    // decodedPayload contains the data you added when issuing the token
    const user = decodedPayload.user;
    res.json({ isLoggedIn: true, user });
  });
});


// Log Out / per te hequr Cookies pas log out
app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ status: 'logged out' });
});



//  New Route per te marre directions
app.get('/directions', async (req, res) => {
    const { origin, destination, mode} = req.query;
  
    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=${mode}&key=AIzaSyB7I3iKiOJF6_P4upjmNSK4nUdLmZQotSs`);
      res.json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching directions.' });
    }
  });



  app.get('/route', async (req, res) => {
    const { point, vehicle, key } = req.query;
    
    try {
        const response = await axios.get(`https://api.graphhopper.com/api/1/route?point=${point[0]}&point=${point[1]}&vehicle=${vehicle}&key=${key}`);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching route.' });
    }
  });
  



//Admin create section
app.post('/api/admin/create', adminController.createAdmin);

//
app.post('/api/blogpost/create', verifyAdmin, BlogPostController.createPost);


app.listen(port, () => console.log(`Listening on port: ${port}`));
