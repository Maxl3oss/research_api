const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const authenticateJWT = (req, res, next) => {
   const authHeader = req.headers.authorization;
   if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, dotenv.parsed.TOKEN_SECRET, (err, user) => {
         if (err) {
            return res.status(403).send("Token Time out!!");
         }
         next();
      });
   } else {
      res.status(403).send("Not have Token!!");
   }
};
module.exports = authenticateJWT;