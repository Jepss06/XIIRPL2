var mysql = require("mysql");
// membuat koneksi
var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "market",
});

db.connect(function (error) {
  if (error) throw error;
  console.log("conect");
});

module.exports = db;
