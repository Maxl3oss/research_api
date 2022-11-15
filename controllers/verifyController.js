const jwt = require('jsonwebtoken');
const db = require('../database/conn');
const dotenv = require('dotenv').config();

exports.verifyEmail = async (req, res) => {
   const email = jwt.decode(req.query.mail);
   console.log(email);
   if (email === null) {
      res.status(400).send(`
         <title>Verified</title>
         <link rel="icon" href="${__dirname}/images/iconscout_logo.ico" />
         <body style="background-color: #222; color: #fff; font-family:courier; width: 100%; text-align:center;">
            <h1 style="padding: 50px 0px 0px;">
               Failed to verify.
            </h1>
         </body>
         `);
      return;
   }
   const query = `UPDATE users SET isVerified="1" WHERE user_email="${email.mail}"`;
   db.query(query, async (err, data) => {
      if (err) {
         res.status(400).send(`
         <title>Verified</title>
         <link rel="icon" href="${__dirname}/images/iconscout_logo.ico" />
         <body style="background-color: #222; color: #fff; font-family:courier; width: 100%; text-align:center;">
            <h1 style="padding: 50px 0px 0px;">
               Failed to verify.
            </h1>
         </body>
         `);
      }
      return;
   })
   res.status(200).send(`
      <title>Verified</title>
      <link rel="icon" href="${__dirname}/images/iconscout_logo.ico" />
      <body style="background-color: #222; color: #fff; font-family:courier; width: 100%; text-align:center;">
         <h1 style="padding: 50px 0px 0px;">
            Verification successful.
         </h1>
         <a style="cursor: pointer; 
            border-radius: 12px; 
            background-color: rgb(84, 84, 84); 
            color: #fff; 
            border-radius: 4px;
            box-sizing: border-box;
            font-size: 16px;
            font-weight: 700;
            line-height: 5;
            outline: none;
            overflow: hidden;
            padding: 15px 15px 15px;
            text-decoration: none;
            " href="http://${dotenv.parsed.HOST}:${dotenv.parsed.PORT}/signIn">
               Sing In
            </a>
      </body>
   `);
}

