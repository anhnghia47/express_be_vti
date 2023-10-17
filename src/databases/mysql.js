const mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ntn",
  database: "TestingSystem",
});

// connect to database
connection.connect(function(err) {
  if (err) throw err;
});

module.exports = connection;

