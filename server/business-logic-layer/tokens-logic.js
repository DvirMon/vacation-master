const dal = require("../dal/dal");
const tokensTable = process.env.NODE_ENV === "production" ? "heroku_cca5cefff42ac85.tokens" : "tokens";

const getDatabaseToken = async (id) => {
  const payload = [id];
  const sql = `SELECT refreshToken FROM ${tokensTable} WHERE id = ?`;
  const refreshToken = await dal.executeAsync(sql, payload);
  return refreshToken[0];
};

const addToken = async (tokens) => {
  const payload = [tokens.refreshToken];
  const sql = `INSERT INTO ${tokensTable}(refreshToken) VALUES(?)`;
  const info = await dal.executeAsync(sql, payload);
  tokens.id = info.insertId;
  return tokens;
}; 

const deleteToken = async (id) => {
  const payload = [id];
  const sql = `DELETE FROM ${tokensTable} WHERE id = ?`;
  await dal.executeAsync(sql, payload);
};

module.exports = {
  getDatabaseToken,
  addToken,
  deleteToken,
};
