const db = require("../database/conn");
const jwt = require("jsonwebtoken");
const path = require("path");
const dotenv = require("dotenv").config();
const { faker } = require("@faker-js/faker");
const fs = require("fs");

exports.getAll = (req, res) => {
   try {
      const query = `SELECT * FROM research LIMIT 2,4`;
      db.query(query, (err, data) => {
         data?.length ? data : data = [];
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
   try {
      const { id } = req.params;
      // console.log(id);
      const query = `SELECT file_pdf FROM files WHERE file_id=${id}`;
      db.query(query, async (err, data) => {
         // console.log(path.join(__dirname, '../uploads/pdf/') + data[0].file_pdf);
         // path.join(__dirname, '../uploads/') + file.fieldname
         data?.length ? data : data = [];
         if (data.length) {
            return res.download(path.join(__dirname, '../uploads/pdf', data[0].file_pdf), (err) => {
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
      const query = `SELECT research.*,files.file_image AS image,files.file_pdf FROM research LEFT JOIN files ON research.file_id=files.file_id WHERE research.id=${id}`

      db.query(query, (err, data) => {
         // console.log(__dirname + "/pdf/Exercise.pdf");
         data?.length ? data : data = [];
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

      // let query = `SELECT *,file_image AS image FROM research LEFT JOIN files ON research.file_id=files.file_id HAVING isVerified=1`;
      let query = `SELECT research.*, file_image AS image, CONCAT(users.user_fname ,' ', users.user_lname) AS user_name FROM research 
                  LEFT JOIN files ON research.file_id=files.file_id
                  LEFT JOIN users_research ON users_research.research_id=research.id 
                  LEFT JOIN users ON users_research.user_id=users.user_id
                  HAVING research.isVerified=1`
      if (search && type === "all") {
         query = query.replace("HAVING isVerified=1", "");
         query += ` AND title LIKE "%${search}%" OR creator LIKE "%${search}%" OR description LIKE "%${search}%" AND isVerified=1`;
      } else {
         if (search && type) query += ` AND ${type} LIKE "%${search}%"`;
      }
      query += ` LIMIT ${start_idx},${per_page}`;
      // console.log(query);

      db.query(query, (err, data) => {
         const qtyCount = query.replace("research.*, file_image AS image, CONCAT(users.user_fname ,' ', users.user_lname) AS user_name", "COUNT(id)").replace("HAVING research.isVerified=1", "AND research.isVerified=1").replace("AND isVerified=1", "").split(" ").slice(0, -2).join(" ");
         data?.length ? data : data = [];
         if (data.length) {
            //count data research
            // console.log(qtyCount);
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
   try {
      const files = req.files;
      // console.log(JSON.parse(req.body.info));
      const { user_id, title, title_alternative, creator, subject, publisher, contributor, date, source, rights, description } = JSON.parse(req.body.info);
      const query = `INSERT INTO files (file_pdf,file_image) VALUES ("${files[0].filename}","public/images/${files[1].filename}")`;
      db.query(query, (err, result) => {
         // insert files
         const query = `INSERT INTO research (id, title, title_alternative, creator,  subject, description, publisher, contributor, date, source, rights, file_id)
                        VALUES (NULL ,"${title}", "${title_alternative}", "${creator}",  "${subject}", "${description}", "${publisher}", "${contributor}", "${date}", "${source}", "${rights}", ${result.insertId})`
         db.query(query, (err, data) => {
            // insert research
            // console.log(data);
            if (err) {
               return res.status(505).json({
                  message: "Server Error",
                  data: err,
               });
            }
            const query = `INSERT INTO users_research(user_id, research_id) VALUES (${user_id},${data.insertId})`
            db.query(query, (err, info) => {
               // insert users_research
               if (err) {
                  return res.status(505).json({
                     message: "Server Error",
                     data: err,
                  });
               }
               return res.status(200).json({
                  status: true,
                  message: "Ok",
                  data: info,
               });
            });
         });
         if (err) {
            return res.status(505).json({
               message: "Server Error",
               data: err,
            });
         }
         // console.log(result.insertId);
      })
   } catch (err) {
      console.log(err);
      return res.status(500).json({
         status: false,
         message: "Server Error",
         data: err,
      });
   }
}

exports.getResearchByUser = (req, res) => {
   try {
      const { id } = req.params;
      const page = req.query.page;
      const per_page = req.query.per_page;
      const start_idx = (page - 1) * per_page;

      let query = `SELECT research.id, research.title, research.creator, research.date, research.isVerified, files.file_image AS image FROM users_research INNER JOIN research ON users_research.research_id=research.id AND users_research.user_id=${id} LEFT JOIN files ON files.file_id=research.file_id`;
      query += ` LIMIT ${start_idx},${per_page}`;

      db.query(query, (err, data) => {
         // getResearchByUser
         const qtyCount = query.replace("research.id, research.title, research.creator, research.date, research.isVerified, files.file_image AS image", "COUNT(id)").split(" ").slice(0, -2).join(" ");
         // console.log(qtyCount);
         db.query(qtyCount, (err, result) => {
            data?.length ? data : data = [];
            if (data.length) {
               const total = result[0]['COUNT(id)'];
               // console.log(result);
               return res.status(200).json({
                  status: "success",
                  page: page,
                  per_page: per_page,
                  total: total,
                  total_pages: Math.ceil(total / per_page),
                  length: data.length,
                  data: data
               });
            } else {
               return res.status(200).json({
                  status: "success",
                  message: "Not Found",
                  data: data
               });
            }
         });
      });
   } catch (err) {
      // console.log(err);
      return res.status(500).json({
         status: false,
         message: "Server Error",
         data: err
      });
   }
}

exports.updateResearch = (req, res) => {
   try {
      const { file_id, research_id, user_id, title, title_alternative, creator, subject, publisher, contributor, source, rights, description } = JSON.parse(req.body.info);
      // delete image in directory
      const queryFiles = `SELECT file_pdf, file_image FROM files WHERE file_id=${file_id}`;
      db.query(queryFiles, (err, data) => {
         let { file_pdf, file_image } = data[0];
         if (err) {
            return res.status(505).json({
               message: "Server Error",
               data: err,
            });
         }
         // update image 
         const files = req.files;
         let query = `UPDATE files SET `;
         // console.log(files.length);
         if (files.length >= 0) {
            files.map((e, i) => {
               if (i > 0) query += `, `;
               if (files[i].fieldname === "images") {
                  console.log("images -> " + files[i].path);
                  query += `file_image="public/images/${files[i].filename}"`;
                  // delete image 
                  file_image = file_image.replace("public/", "");
                  fs.unlink(path.join(__dirname, '../uploads/') + file_image, (err) => {
                     if (err) {
                        throw err;
                     }
                     console.log(`Delete File(${file_image}) successfully.`);
                  });
               }
               if (files[i].fieldname === "pdf") {
                  console.log("pdf -> " + files[i].path);
                  query += `file_pdf="${files[i].filename}"`;
                  // delete pdf
                  fs.unlink(path.join(__dirname, '../uploads/pdf/') + file_pdf, (err) => {
                     if (err) {
                        throw err;
                     }
                     console.log(`Delete File(${file_pdf}) successfully.`);
                  });
               }
            });
         }
         query += ` WHERE file_id=${file_id}`;
         // console.log(query);
         // if have image and pdf update
         if (files.length > 0) {
            db.query(query, (err, result) => {
               // console.log(result);
               if (err) {
                  return res.status(505).json({
                     message: "Server Error",
                     data: err,
                  });
               }
            })
         }
         // update data in from
         // console.log(req.body.info);
         const queryInfo = `UPDATE research SET title='${title}',title_alternative='${title_alternative}',creator='${creator}',subject='${subject}',publisher='${publisher}', contributor='${contributor}',source='${source}',rights='${rights}',description='${description}' WHERE id=${research_id}`;
         db.query(queryInfo, (err, info) => {
            if (err) {
               return res.status(505).json({
                  message: "Server Error",
                  data: err,
               });
            }
            return res.status(200).json({
               status: true,
               message: "Ok"
            });
         })
      });
   } catch (err) {
      // console.log(err);
      return res.status(500).json({
         status: false,
         message: "Server Error",
         data: err
      });
   }
}

exports.delResearchByUser = (req, res) => {
   try {
      const { user_id, research_id } = req.body;
      const queryFiles = `SELECT files.file_pdf,files.file_image FROM research INNER JOIN files ON research.file_id=files.file_id AND research.id=${research_id}`;
      db.query(queryFiles, (err, data) => {
         const query = `DELETE research, files, users_research FROM research INNER JOIN files ON research.file_id=files.file_id INNER JOIN users_research ON research.id=users_research.research_id AND users_research.user_id=${user_id} WHERE research.id=${research_id}`
         // console.log(err);
         if (err) {
            return res.status(500).json({
               status: false,
               message: "Server Error",
               data: err
            });
         }
         db.query(query, (err, result) => {
            if (err) {
               return res.status(500).json({
                  status: false,
                  message: "Server Error",
                  data: err
               });
            }
            // delete image in directory
            let { file_pdf, file_image } = data[0];
            file_image = file_image.replace("public/", "");
            fs.unlink(path.join(__dirname, '../uploads/') + file_image, (err) => {
               if (err) {
                  throw err;
               }
               console.log(`Delete File(${file_image}) successfully.`);
            });
            fs.unlink(path.join(__dirname, '../uploads/pdf/') + file_pdf, (err) => {
               if (err) {
                  throw err;
               }
               console.log(`Delete File(${file_pdf}) successfully.`);
            });
            return res.status(200).json({
               status: true,
               message: "Ok"
            });
         });
      })

   } catch (err) {
      // console.log(err);
      return res.status(500).json({
         status: false,
         message: "Server Error",
         data: err
      });
   }
}


// get research on user id
// SELECT research.* FROM `users_research` INNER JOIN research ON users_research.research_id=research.id AND users_research.user_id = 94