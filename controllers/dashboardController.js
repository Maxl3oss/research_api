const db = require("../database/conn");

exports.get = (req, res, next) => {
   const query = `SELECT  (SELECT COUNT(user_id)FROM users) AS count_users,(SELECT COUNT(research.id) FROM research) AS count_research`;
   db.query(query, async (err, data) => {
      if (data.length) {
         res.status(200).json({
            count_users: data[0].count_users,
            count_research: data[0].count_research
         })
      }
   })
}