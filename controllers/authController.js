const db = require("../database/conn");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

exports.signIn = (req, res) => {
  const { email, pass } = req.body;
  console.log(req.body);
  const query = `SELECT user_pass FROM users WHERE user_email = "${email}"`;
  db.query(query, async (err, data) => {
    if (data.length > 0) {
      const isCorrect = await bcrypt.compare(pass, data[0].user_pass);
      if (isCorrect) {
        const token = jwt.sign(
          {
            userID: data[0].user_id, email: data[0].user_email
          }
          , dotenv.parsed.TOKEN_SECRET,
          {
            expiresIn: '100'
          });

        res.status(200).json({
          status: "success",
          message: "Login successfully",
          data: data[0],
          token: token,
        });
      } else {
        res.status(401).json({
          status: "fail",
          message: "Incorrect email or password",
        });
      }
    } else {
      res.status(401).json({
        status: "fail",
        message: "Incorrect email or password",
      });
    }
  });
};

exports.signUp = async (req, res) => {
  const { fname, lname, email, pass } = req.body;
  const hashPass = await bcrypt.hash(pass, 10);
  const query = `INSERT INTO users (user_fname,user_lname,user_email,user_pass,permission_id) VALUES ("${fname}","${lname}","${email}","${hashPass}",1)`;
  db.query(query, (err, data) => {
    if (err) {
      res.status(400).json({ status: "fail", message: err });
      return;
    }
    res
      .status(200)
      .json({ status: "success", message: "registered!!", data: data });
  });
};
