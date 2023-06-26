const jwt = require("jsonwebtoken");


const jwtSecret = process.env.JWT_SECRET;

module.exports.secret = jwtSecret;
module.exports.authenticate = (req, res, next) => {
  jwt.verify(req.cookies.usertoken, jwtSecret, (err, payload) => {
    if (err) { 
      res.status(401).json({verified: false});
    } else {
      next();
    }
  });
}

