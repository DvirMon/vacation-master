const dal = require("../dal/dal");

const getToken = async token => {
  const sql = `SELECT * FROM tokens WHERE refreshToken = ('${token}')`;
  const dbToken = await dal.executeAsync(sql);
  return dbToken[0];
};

const addToken = async token => {
  const sql = `INSERT INTO tokens(refreshToken)
               VALUES('${token}')`;
  const info = await dal.executeAsync(sql);
  token.id = info.insertId
  return token;
};

const deleteToken = async id => {
  const sql = `DELETE FROM tokens WHERE id = ${id}`;
  await dal.executeAsync(sql);
};

module.exports = {
  getToken,
  addToken,
  deleteToken
};
