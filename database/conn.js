const mysql = require("mysql2");

// const db = mysql.createConnection({
//   host: "172.17.0.1",
//   user: "root",
//   password: "bPFcM0jB7jnH5ZYN",
//   database: "project_research",
// });

// const DATABASE_URL = process.env.DATABASE_URL;
const db = mysql.createConnection(process.env.DATABASE_URL);

db.connect((err) => {
  if (err) {
    console.log("error connecting : " + err.stack);
    return;
  }
});

// db.end();
module.exports = db;