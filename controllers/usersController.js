const db = require("../database/conn");
const bcrypt = require("bcrypt");

exports.getAll = (req, res) => {
   try {
      const query = `SELECT * FROM users`;
      db.query(query, async (err, data) => {
         if (data.length) {
            return res.status(200).json({
               status: true,
               message: "Ok",
               data: data,
            });
         } else {
            return res.status(400).json({
               status: false,
               message: "Get Users Error",
            });
         }
      })
   } catch (err) {
      return res.status(500).json({
         status: false,
         message: "Server Error",
         data: err,
      });
   }
}

exports.editByUser = async (req, res) => {
   try {
      // console.log(req.body);
      const { user_id, user_fname, user_lname } = req.body;
      let { user_pass } = req.body;
      let query = `UPDATE users SET user_fname="${user_fname}", user_lname="${user_lname}" `;
      if (user_pass) {
         const hashPass = await bcrypt.hash(user_pass, 10);
         query += `, user_pass="${hashPass}" `;
      }
      query += `WHERE user_id=${user_id}`;

      // console.log(query);
      db.query(query, (err, data) => {
         if (err) {
            return res.status(505).json({
               message: "Server Error",
               data: err,
            });
         }
         return res.status(200).json({
            status: true,
            message: "OK",
            data: data
         });
      })
   } catch (err) {
      return res.status(500).json({
         status: false,
         message: "Server Error",
         data: err,
      });
   }
}

exports.getUserByEmail = (req, res) => {
   try {
      const { user_email } = req.body;
      console.log(req.body);
      const query = `SELECT user_id, user_fname, user_lname, user_email, role_id, isVerified FROM users WHERE user_email="${user_email}"`;
      console.log(query);
      db.query(query, (err, data) => {
         console.log(data);
         if (err) {
            return res.status(505).json({
               message: "Server Error",
               data: err,
            });
         }
         return res.status(200).json({
            status: true,
            message: "OK",
            data: data
         });
      })
   } catch (err) {
      return res.status(500).json({
         status: false,
         message: "Server Error",
         data: err,
      });
   }
}