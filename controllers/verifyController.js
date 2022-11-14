const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

exports.verifyEmail = async (req, res) => {
   const email = req.query.mail;
   const token = jwt.decode(email);
   console.log(token.mail);
   res.status(200).send(`<h1>HH</h1>`);
}

