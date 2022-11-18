const db = require("../database/conn");
const jwt = require("jsonwebtoken");
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

exports.getLimit = (req, res) => {
   try {
      const page = req.query.page;
      const per_page = req.query.per_page;
      const start_idx = (page - 1) * per_page;
      const type = req.query.type;
      const search = req.query.search;

      let query = `SELECT * FROM research`;
      if (search && type === "all") {
         query += ` WHERE title LIKE "%${search}%" OR creator LIKE "%${search}%" OR description LIKE "%${search}%"`;
      } else {
         if (search && type) query += ` WHERE ${type} LIKE "%${search}%"`;
      }
      query += ` LIMIT ${start_idx},${per_page}`;
      // console.log(query);

      db.query(query, async (err, data) => {
         const qtyCount = query.replace("*", "COUNT(id)").split(" ").slice(0, -2).join(" ");
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
      console.log(err);
      return res.status(500).json({
         status: false,
         message: "Server Error",
         data: err,
      })
   }
}

exports.post = (req, res) => {
   const token = req.headers.authorization.split(" ")[1];
   let decoded = jwt.verify(token, dotenv.parsed.TOKEN_SECRET);
   console.log(token);
   // for (i = 0; i <= 100; i++) {
   //    const createRS = {
   //       title: faker.commerce.product(),
   //       title_alternative: faker.company.name(),
   //       creator: faker.internet.userName(),
   //       subject: faker.animal.cat(),
   //       description: faker.lorem.paragraph(),
   //       publisher: faker.internet.userName(),
   //       contributor: faker.internet.userName(),
   //       date: new Date().toISOString().slice(0, 19).replace('T', ' '),
   //       source: faker.internet.userName(),
   //       language: "tha",
   //       rights: faker.internet.userName()
   //    }
   //    const query = `INSERT INTO research (id, title, title_alternative, creator, subject, description, publisher, contributor, date, source, language, rights) VALUES(NULL ,"${createRS.title}", "${createRS.title_alternative}", "${createRS.creator}", "${createRS.subject}", "${createRS.description}", "${createRS.publisher}", "${createRS.contributor}", "${createRS.date}", "${createRS.source}", "${createRS.language}", "${createRS.rights}")`;

   //    db.query(query);
   // }
   res.status(200).json({ token: decoded })
   // res.status(200).json({ decode: decoded, fk: faker.lorem.paragraph() });

}