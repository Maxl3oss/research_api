const db = require("../database/conn");

exports.get = (req, res, next) => {
  try {
    const query = `
      SELECT 
      (SELECT COUNT(user_id) FROM users LEFT JOIN roles ON roles.id=users.role_id WHERE roles.name="admin") AS admin,
      (SELECT COUNT(user_id) FROM users LEFT JOIN roles ON roles.id=users.role_id WHERE roles.name="users") AS users,
      (SELECT COUNT(user_id) FROM users WHERE isVerified=0) AS user_notVerified,
      (SELECT COUNT(id) FROM research WHERE isVerified=0) AS rs_Unverified,
      (SELECT COUNT(id) FROM research WHERE isVerified=1) AS rs_Verified
      FROM users LIMIT 1
   `;
    db.query(query, async (err, data) => {
      data.length ? data : (data = []);
      if (data.length) {
        return res.status(200).json({
          status: true,
          message: "Ok",
          data: data,
        });
      }
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Server Error",
      data: err,
    });
  }
};
