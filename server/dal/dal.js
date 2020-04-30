const mysql = require("mysql");

const connection = mysql.createConnection(config.mysql);

connection.connect((err) => {
  if (err) {
    console.log(err.message);
    return;
  }
  console.log("We Are Connected To Vacation MySQL Database");
});

const executeAsync = (sql) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        reject(err.message);
        return;
      }
      resolve(result);
    });
  });
};

module.exports = {
  executeAsync,
};
