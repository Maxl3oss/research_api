const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const db = require("../database/conn");

exports.authenticateJWT = (req, res, next) => {
   const token = req.cookies.access_token;
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

exports.isAdmin = (req, res, next) => {
   const token = req.cookies.access_token;
   const { userId, email } = jwt.verify(token, dotenv.parsed.REFRESH_TOKEN_SECRET);
   // SELECT roles.name FROM `users` INNER JOIN roles ON id=users.role_id AND users.user_id=92 AND users.user_email = "maxl3oss10@gmail.com"
   const query = `SELECT roles.name FROM users INNER JOIN roles ON id=users.role_id AND users.user_id=${userId} AND users.user_email = "${email}"`;
   db.query(query, async (err, data) => {
      // console.log(data);
      if (data.length > 0) {
         // console.log(data[0].name);
         const role = data[0].name;
         if (role !== "admin") {
            return res.status(401).send("Unauthorized");
         }
         next();
      }
   });

   console.log(userId, email);
}

