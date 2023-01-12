const db = require("../database/conn");
const bcrypt = require("bcrypt");

exports.getAll = (req, res) => {
   try {
      const page = req.query.page;
      const per_page = req.query.per_page;
      const start_idx = (page - 1) * per_page;

      let query = `SELECT user_id, user_fname, user_lname, user_email, role_id, isVerified FROM users ORDER BY user_id DESC`;
      query += ` LIMIT ${start_idx},${per_page} `;
      // console.log(query);
      db.query(query, async (err, data) => {
         const qtyCount = `SELECT COUNT(user_id) FROM users`;
         data?.length ? data : data = [];
         if (data.length) {
            db.query(qtyCount, (err, result) => {
               const total = result[0]['count(user_id)'];
               return res.status(200).json({
                  status: true,
                  page: page,
                  per_page: per_page,
                  total: total,
                  total_pages: Math.ceil(total / per_page),
                  length: data.length,
                  data: data,
               });
            })
         }
         if (err) {
            return res.status(500).json({
               status: false,
               message: "Server Error",
               data: err,
            });
         }
      })
   } catch (err) {
      return res.status(500).json({
         status: false,
         message: "Server Error",
      });
   }

}
exports.getUserById = (req, res) => {
   try {
      const { id } = req.params;
      const query = `SELECT user_id, user_fname, user_lname, user_email, role_id, isVerified FROM users WHERE user_id = ${id}`;
      db.query(query, (err, data) => {
         if (err) return res.send(err);
         return res.status(200).json({
            status: true,
            message: "OK",
            data: data[0]
         })
      })
   } catch (err) {
      console.log(err);
      return res.status(500).json({
         status: false,
         message: "Server Error",
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
            return res.send(err);
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

exports.editUserById = async (req, res) => {
   try {
      // console.log(req.body);
      const { user_id, user_fname, user_lname } = req.body;
      let { user_pass, role_id } = req.body;
      let query = `UPDATE users SET user_fname="${user_fname}", user_lname="${user_lname}" `;
      if (user_pass) {
         const hashPass = await bcrypt.hash(user_pass, 10);
         query += `, user_pass="${hashPass}" `;
      }
      if (role_id) query += `, role_id="${role_id} "`
      query += `WHERE user_id=${user_id}`;
      console.log(query);
      db.query(query, (err, data) => {
         if (err) {
            return res.status(500).send(err);
         }
         return res.status(200).json({
            status: true,
            message: "OK",
            data: data
         });
      })
   } catch (err) {
      console.log(err);
      return res.status(500).json({
         status: false,
         message: "Server Error",
      });
   }
}

exports.getUserByEmail = (req, res) => {
   try {
      const { user_email } = req.body;
      // console.log(req.body);
      const query = `SELECT user_id, user_fname, user_lname, user_email, role_id, isVerified FROM users WHERE user_email="${user_email}"`;
      // console.log(query);
      db.query(query, (err, data) => {
         if (err) {
            return res.send(err);
         }
         return res.status(200).json({
            status: true,
            message: "OK",
            data: data
         });
      })
   } catch (err) {
      console.log(err);
      return res.status(500).json({
         status: false,
         message: "Server Error",
      });
   }
}

exports.delUserById = (req, res) => {
   try {
      const { user_id } = req.body;
      const query = `DELETE FROM users WHERE user_id=${user_id}`;
      // console.log(query);
      db.query(query, (err, data) => {
         data?.length ? data : data = [];
         if (data) {
            return res.status(200).json({
               status: true,
               message: "OK",
               data: data
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

exports.verifiedUser = (req, res) => {
   try {
      const { user_id } = req.body;
      const query = `UPDATE users SET isVerified=1 WHERE user_id=${user_id}`;
      db.query(query, (err, data) => {
         data?.length ? data : data = [];
         if (data) {
            return res.status(200).json({
               status: true,
               message: "Ok"
            });
         }
      })
   } catch (err) {
      return res.status(500).json({
         status: false,
         message: "Server Error",
         data: err
      });
   }
}

exports.unVerifiedUser = (req, res) => {
   try {
      const { user_id } = req.body;
      const query = `UPDATE users SET isVerified=0 WHERE user_id=${user_id}`;
      db.query(query, (err, data) => {
         data?.length ? data : data = [];
         if (data) {
            return res.status(200).json({
               status: true,
               message: "Ok"
            });
         }
      })
   } catch (err) {
      return res.status(500).json({
         status: false,
         message: "Server Error",
         data: err
      });
   }
}