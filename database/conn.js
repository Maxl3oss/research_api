const mysql = require("mysql2");

// const db = mysql.createConnection({
//   host: "172.17.0.1",
//   user: "root",
//   password: "bPFcM0jB7jnH5ZYN",
//   database: "project_research",
// });
const db = mysql.createConnection('mysql://cmd0b00q74bd7iq2tepi:pscale_pw_QuFoYAZRyfGS0PrJeoOUDWQRFsG8jwEebQdksaRWnv9@ap-northeast.connect.psdb.cloud/project_research?ssl={"rejectUnauthorized":true}');

db.connect((err) => {
  if (err) {
    console.log("error connecting : " + err.stack);
    return;
  }
});

// db.end();
module.exports = db;