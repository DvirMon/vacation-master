const dal = require("../dal/dal");

const getDatabaseToken = async (id) => {
  const payload = [id];
  const sql = `SELECT refreshToken FROM tokens WHERE id = ?`;
  const refreshToken = await dal.executeAsync(sql, payload);
  return refreshToken[0];
};

const addToken = async (tokens) => {
  const payload = [tokens.refreshToken];
  const sql = `INSERT INTO tokens(refreshToken) VALUES(?)`;
  const info = await dal.executeAsync(sql, payload);
  tokens.id = info.insertId;
  return tokens;
};

const deleteToken = async (id) => {
  const payload = [id];
  const sql = `DELETE FROM tokens WHERE id = ?`;
  await dal.executeAsync(sql, payload);
};

module.exports = {
  getDatabaseToken,
  addToken,
  deleteToken,
};
