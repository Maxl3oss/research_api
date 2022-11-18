const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const authenticateJWT = (req, res, next) => {
   const token = req.cookies.access_token;
   // console.log(jwt.decode(token));
   if (token) {
      jwt.verify(token, dotenv.parsed.REFRESH_TOKEN_SECRET, (err, user) => {
         if (err) {
            return res.status(403).send("Token Time out!!");
         }
         next();
      });
   } else {
      res.status(401).send("Token not found");
   }
};
module.exports = authenticateJWT;