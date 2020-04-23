const dal = require("../dal/dal");

const getDatabaseToken = async id => {
  const sql = `SELECT refreshToken FROM tokens WHERE id = ${id}`;
  const refreshToken = await dal.executeAsync(sql);
  return refreshToken[0];
};

const addToken = async tokens => {
  const sql = `INSERT INTO tokens(refreshToken) VALUES('${tokens.refreshToken}')`;
  const info = await dal.executeAsync(sql);
  tokens.id = info.insertId 
  return tokens;
};

const deleteToken = async id => {
  const sql = `DELETE FROM tokens WHERE id = ${id}`;
  await dal.executeAsync(sql);
};

module.exports = {
  getDatabaseToken,
  addToken,
  deleteToken
};
