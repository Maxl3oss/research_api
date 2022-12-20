const jwt = require('jsonwebtoken');
const db = require("../database/conn");
require('dotenv').config();

exports.authenticateJWT = (req, res, next) => {
   let token = "";
   req.cookies.access_token ? token = req.cookies.access_token : token = req.headers.authorization;
   // console.log(token);
   if (token) {
      jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
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
   let token = "";
   req.cookies.access_token ? token = req.cookies.access_token : token = req.headers.authorization;
   const { userId, email } = jwt.verify(token, process.env.TOKEN_SECRET);
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
      // console.log("Use Role Admin -> " + userId, email, data[0].name);
   });
}

