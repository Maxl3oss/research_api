const mysql = require("mysql");

const db = mysql.createConnection({
  host: "172.17.0.1",
  user: "root",
  password: "bPFcM0jB7jnH5ZYN",
  database: "project_research",
});

db.connect((err) => {
  if (err) {
    console.log("error connecting : " + err.stack);
    return;
  }
});

// db.end();
module.exports = db;
