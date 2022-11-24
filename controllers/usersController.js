const db = require("../database/conn");

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
      res.status(500).json({
         status: false,
         message: "Server Error",
         data: err,
      })
   }
}
