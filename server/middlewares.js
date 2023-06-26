const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

// Middleware per te verifikuar nqs Useri eshte admin
const verifyAdmin = (req, res, next) => {
    const token = req.cookies.token;
  
    // console.log('Token:', token); 
  
    if (!token) return res.status(401).send('Access Denied');
  
    try {
      const verified = jwt.verify(token, SECRET);
      req.user = verified.user;
  
      // console.log('User:', req.user); 
  
      if(req.user.isAdmin !== true) {
        return res.status(403).send('Access Denied - Not Authorized');
      }
      next();
    } catch (err) {
      // console.log('Error verifying token:', err); 
      res.status(400).send('Invalid Token');
    }
  }

module.exports.verifyAdmin = verifyAdmin;
