const mysql = require("mysql");

const database = process.env.NODE_ENV === "production" ? config.mysql_PROD : config.mysql_PROD;
 
const pool = mysql.createPool(database); 

const handleDisconnect = () => {
  pool.getConnection((err, connection) => {
    if (err) {
      throw err;
    } else {
      console.log("We are connect to MySQL database");
    }
  });
};

const executeAsync = (sql, payload) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, payload, (err, result) => {
      if (err) {
        reject(err.message);
        return;
      }
      resolve(result);
    });
  });
};

handleDisconnect();

module.exports = {
  executeAsync,
};
