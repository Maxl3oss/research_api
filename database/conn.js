const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.host,
  user: process.env.username,
  password: process.env.password,
  database: process.env.project_research,
});
// const db = mysql.createConnection(process.env.DATABASE_URL);

db.connect((err) => {
  if (err) {
    console.log("error connecting : " + err.stack);
    return;
  }
});

// db.end();
module.exports = db;