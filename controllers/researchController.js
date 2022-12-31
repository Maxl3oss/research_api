const db = require("../database/conn");
const cloud = require("../database/cloud");
const path = require("path");
const fs = require("fs");

exports.getAll = (req, res) => {
   try {
      // const query = `SELECT * FROM research LIMIT 0,10`;
      const query = `
      SELECT research.id, research.title, research.date, research.isVerified, users.user_fname, users.user_lname FROM research
      LEFT JOIN users_research ON users_research.research_id=research.id
      LEFT JOIN users ON users.user_id=users_research.user_id 
      LIMIT 0,10
      `;
      // console.log(query);
      db.query(query, (err, data) => {
         data?.length ? data : data = [];
         if (data.length) {
            return res.status(200).json({
               status: true,
               message: "Ok",
               data: data,
            });
         }
         if (err) {
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

exports.getAllResearch = (req, res) => {
   try {
      const page = req.query.page;
      const per_page = req.query.per_page;
      const start_idx = (page - 1) * per_page;
      const type = req.query.type;
      const search = req.query.search;

      // let query = `SELECT *,file_image AS image FROM research LEFT JOIN files ON research.file_id=files.file_id HAVING isVerified=1`;
      let query = `
      SELECT research.id, research.title, research.date, research.isVerified, users.user_fname, users.user_lname FROM research
      LEFT JOIN users_research ON users_research.research_id=research.id
      LEFT JOIN users ON users.user_id=users_research.user_id 
      ORDER BY research.id DESC
      `;

      if (search && type === "all") {
         query = query.replace("HAVING isVerified=1", "");
         query += ` AND title LIKE "%${search}%" OR creator LIKE "%${search}%" OR description LIKE "%${search}%" AND isVerified=1`;
      } else {
         if (search && type) query += ` AND ${type} LIKE "%${search}%"`;
      }

      query += `  LIMIT ${start_idx},${per_page}`;

      // console.log(query);

      db.query(query, (err, data) => {
         const qtyCount = query.replace("research.id, research.title, research.date, research.isVerified, users.user_fname, users.user_lname", "COUNT(id)").replace("ORDER BY research.id DESC", "").split(" ").slice(0, -2).join(" ");
         data?.length ? data : data = [];
         // console.log(data);
         if (data.length) {
            //count data research
            db.query(qtyCount, (err, result) => {
               const total = result[0]['count(id)'];
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
      console.log(err);
      return res.status(500).json({
         status: false,
         message: "Server Error",
         data: err,
      });
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
      let query = `
      SELECT research.*, file_image AS image, CONCAT(users.user_fname ,' ', users.user_lname) AS user_name FROM research 
      LEFT JOIN files ON research.file_id=files.file_id
      LEFT JOIN users_research ON users_research.research_id=research.id 
      LEFT JOIN users ON users_research.user_id=users.user_id
      HAVING research.isVerified=1
      ORDER BY research.id DESC
      `;

      if (search && type === "all") {
         query = query.replace("HAVING research.isVerified=1", `WHERE (title LIKE "%${search}%" OR creator LIKE "%${search}%" OR description LIKE "%${search}%") AND research.isVerified=1`);
      } else {
         if (search && type) query += ` AND ${type} LIKE "%${search}%"`;
      }
      query += ` LIMIT ${start_idx},${per_page}`;

      // console.log(query);

      db.query(query, (err, data) => {
         const qtyCount = query.replace("research.*, file_image AS image, CONCAT(users.user_fname ,' ', users.user_lname) AS user_name", "COUNT(id)").replace("HAVING research.isVerified=1", "WHERE research.isVerified=1").replace("ORDER BY research.id DESC", "").split(" ").slice(0, -2).join(" ");
         // console.log(qtyCount);
         data?.length ? data : data = [];
         if (data.length) {
            //count data research
            db.query(qtyCount, (err, result) => {
               const total = result[0]['count(id)'];
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


exports.post = async (req, res) => {
   try {
      // upload file 
      let image_url, pdf_url;
      const uploadFiles = async () => {
         if (req.body.images) {
            await cloud.uploadImage(req.body.images)
               .then((url) => image_url = url)
               .catch((err) => res.status(500).send(err));
         }
         if (req.body.pdf) {
            await cloud.uploadPDF(req.body.pdf)
               .then((url) => pdf_url = url)
               .catch((err) => res.status(500).send(err));
         }
      }
      await uploadFiles();
      // console.log(JSON.parse(req.body.info));
      const { user_id, title, title_alternative, creator, subject, publisher, contributor, date, source, rights, description } = JSON.parse(req.body.info);
      const query = `INSERT INTO files (file_pdf,file_image) VALUES ("${pdf_url}","${image_url}")`;
      db.query(query, (err, result) => {
         // insert files
         if (err) {
            return res.status(505).json({
               message: "insert files",
               data: err,
            });
         }
         const query = `INSERT INTO research (id, title, title_alternative, creator,  subject, description, publisher, contributor, date, source, rights, file_id)
                        VALUES (NULL ,"${title}", "${title_alternative}", "${creator}",  "${subject}", "${description}", "${publisher}", "${contributor}", "${date}", "${source}", "${rights}", ${result.insertId})`
         db.query(query, (err, data) => {
            // insert research
            if (err) {
               return res.status(505).json({
                  message: "errors insert research",
                  data: err,
               });
            }
            const query = `INSERT INTO users_research(user_id, research_id) VALUES (${user_id},${data.insertId})`
            db.query(query, (err, info) => {
               // insert users_research
               if (err) {
                  return res.status(505).json({
                     message: "Errors insert users_research",
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
         // console.log(result.insertId);
      })
   } catch (err) {
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
               const total = result[0]['count(id)'];
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

exports.updateResearchCloud = async (req, res) => {
   try {
      const { file_id, research_id, user_id, title, title_alternative, creator, subject, publisher, contributor, source, rights, description } = JSON.parse(req.body.info);
      const queryFiles = `SELECT file_pdf, file_image FROM files WHERE file_id=${file_id}`;
      // get 
      db.query(queryFiles, async (err, data) => {
         let { file_pdf, file_image } = data[0];
         if (err) {
            return res.status(505).json({
               message: "Server Error",
               data: err,
            });
         }
         // update image 
         let image_url, pdf_url;
         let query = `UPDATE files SET `;
         const uploadFiles = async () => {
            if (req.body.images.length > 300) {
               // delete
               cloud.delete(file_image);
               // upload
               await cloud.uploadImage(req.body.images)
                  .then((url) => image_url = url)
                  .catch((err) => res.status(500).send(err));
               console.log("images -> " + image_url);
               query += `file_image="${image_url}"`;

            }
            if (req.body.pdf.length > 300) {
               // delete
               cloud.delete(file_pdf);
               // upload
               await cloud.uploadPDF(req.body.pdf)
                  .then((url) => pdf_url = url)
                  .catch((err) => res.status(500).send(err));
               console.log("pdf -> " + pdf_url);
               query += `file_pdf="${pdf_url}"`;
            }
         }
         await uploadFiles();
         query += ` WHERE file_id=${file_id}`;
         // update file image || pdf
         if (req.body.images.length > 300 || req.body.pdf.length > 300) {
            db.query(query, (err, result) => {
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
      })
   } catch (err) {
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
         // if have image and pdf update
         if (files.length > 0) {
            db.query(query, (err, result) => {
               // console.log(query);
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
            // console.log(err);
            if (err) {
               return res.status(500).json({
                  status: false,
                  message: "Server Error",
                  data: err
               });
            }
            // delete image in cloudinary
            let { file_pdf, file_image } = data[0];
            cloud.delete(file_pdf);
            cloud.delete(file_image);

            console.log(file_image, file_image);
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

exports.verifiedResearch = (req, res) => {
   try {
      const { research_id } = req.body;
      const query = `UPDATE research SET isVerified=1 WHERE id=${research_id}`;
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

exports.unVerifiedResearch = (req, res) => {
   try {
      const { research_id } = req.body;
      const query = `UPDATE research SET isVerified=0 WHERE id=${research_id}`;
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

exports.download = (req, res) => {
   return res.status(200).json({
      status: true,
      message: "Ok"
   })
}