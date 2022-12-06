const db = require("../database/conn");
const jwt = require("jsonwebtoken");
const path = require("path");
const dotenv = require("dotenv").config();
const { faker } = require("@faker-js/faker");

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

exports.getFileById = (req, res) => {
   const { id } = req.params;
   // console.log(id);
   try {
      const query = `SELECT file_pdf FROM files WHERE file_id=${id}`;
      db.query(query, async (err, data) => {
         // console.log(path.join(__dirname, '../uploads/pdf/') + data[0].file_pdf);
         // path.join(__dirname, '../uploads/') + file.fieldname
         if (data.length) {
            res.download(path.join(__dirname, '../uploads/pdf', data[0].file_pdf), (err) => {
               if (err) {
                  return res.status(400).json({
                     status: false,
                     message: err,
                  });
               }
               // console.log("OK");
            })

         } else {
            return res.status(400).json({
               status: false,
               message: "Get File Error",
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

exports.getById = (req, res) => {
   try {
      const { id } = req.params;
      // const query = `SELECT *,file_name FROM research INNER JOIN files ON research.id=${id}`;
      const query = `SELECT research.*,files.file_image AS image,files.file_pdf FROM research LEFT JOIN files ON research.file_id=files.file_id WHERE research.id=${id} HAVING isVerified=1`

      db.query(query, async (err, data) => {
         // console.log(__dirname + "/pdf/Exercise.pdf");
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
      return res.status(500).json({
         status: false,
         message: "Server Error",
         data: err,
      });
   }
}


exports.getLimit = (req, res) => {
   try {
      const page = req.query.page;
      const per_page = req.query.per_page;
      const start_idx = (page - 1) * per_page;
      const type = req.query.type;
      const search = req.query.search;

      let query = `SELECT *,file_image AS image FROM research LEFT JOIN files ON research.file_id=files.file_id HAVING isVerified=1`;
      if (search && type === "all") {
         query += ` WHERE title LIKE "%${search}%" OR creator LIKE "%${search}%" OR description LIKE "%${search}%"`;
      } else {
         if (search && type) query += ` WHERE ${type} LIKE "%${search}%"`;
      }
      query += ` LIMIT ${start_idx},${per_page}`;
      // console.log(query);

      db.query(query, async (err, data) => {
         const qtyCount = query.replace("*", "COUNT(id)").replace("HAVING isVerified=1", "").split(" ").slice(0, -2).join(" ");
         // console.log(qtyCount);
         if (data.length) {
            //count data research
            db.query(qtyCount, (err, result) => {
               const total = result[0]['COUNT(id)'];
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
               data: data,
            });
         }
      })
   } catch (err) {
      // console.log(err);
      return res.status(500).json({
         status: false,
         message: "Server Error",
         data: err,
      });
   }
}

exports.post = (req, res) => {
   const files = req.files;
   console.log(files);
   const { title, title_alternative, creator, subject, publisher, contributor, date, source, rights, description } = JSON.parse(req.body.info);
   const query = `INSERT INTO files (file_pdf,file_image) VALUES ("${files[0].filename}","public/images/${files[1].filename}")`;
   db.query(query, async (err, result) => {
      if (err) {
         return res.status(505).json({
            status: false,
            message: "Server Error",
            data: err,
         });
      }
      const query = `INSERT INTO research (id, title, title_alternative, creator,  subject, description, publisher, contributor, date, source, rights, file_id)
                     VALUES (NULL ,"${title}", "${title_alternative}", "${creator}",  "${subject}", "${description}", "${publisher}", "${contributor}", "${date}", "${source}", "${rights}", ${result.insertId})`
      db.query(query, async (err, data) => {
         if (err) {
            return res.status(400).json({
               data: err
            });
         }
         return res.status(200).json({
            data: data
         });
      })
      // console.log(result.insertId);
   })
}