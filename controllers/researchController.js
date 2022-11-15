const db = require("../database/conn");

exports.getAll = (req, res) => {
   try {
      const query = `SELECT * FROM research LIMIT 2,4`;
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
               message: "Get Research Error",
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

exports.getLimit = (req, res) => {
   try {
      const page = req.query.page;
      const per_page = req.query.per_page;
      const start_idx = (page - 1) * per_page;
      const type = req.query.type;
      const search = req.query.search;

      let query = `SELECT * FROM research`;
      if (search && type) query += ` WHERE ${type} LIKE "%${search}%"`;
      query += ` LIMIT ${start_idx},${per_page}`;
      console.log(query);

      db.query(query, async (err, data) => {
         // console.log(data);
         if (data.length) {
            //count data research
            db.query("SELECT COUNT(id) as count FROM research", (err, result) => {
               const total = result[0]['count'];
               return res.status(200).json({
                  status: "success",
                  page: page,
                  per_page: per_page,
                  total: total,
                  total_pages: Math.ceil(total / per_page),
                  length: data.length,
                  data: data,
               });
            });
         } else {
            return res.status(200).json({
               status: "success",
               message: "Not Found",
            });
         }
      })
   } catch (err) {
      console.log(err);
      return res.status(500).json({
         status: false,
         message: "Server Error",
         data: err,
      })
   }
}