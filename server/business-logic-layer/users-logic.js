const dal = require("../dal/dal");

const users = process.env.NODE_ENV === "production" ? "heroku_cca5cefff42ac85.users" : "users";

const getUserDetails = async (user) => {
  const payload = [user.userName];
  const sql = `SELECT uuid, isAdmin, firstName, lastName, userName FROM ${users} 
  WHERE BINARY userName = ?`;
  const dbUser = await dal.executeAsync(sql, payload);
  return dbUser[0];
};

// get password (login)
const getUserPassword = async (uuid) => {
  const payload = [uuid];
  const sql = `SELECT password FROM ${users} WHERE uuid = ?`;
  const password = await dal.executeAsync(sql, payload);
  return password[0];
};

// validate id (followup)
const isUserIdExist = async (uuid) => {
  const payload = [uuid];
  const sql = `SELECT id FROM ${users} WHERE uuid = ?`;
  const id = await dal.executeAsync(sql, payload);
  return id[0];
};

// add new user (registration)
const addUser = async (user) => {
  const payload = [user.firstName, user.lastName, user.userName, user.password];
  const sql = `INSERT INTO ${users}(uuid, firstName, lastName, userName, password)
  VALUES (UUID(), ?, ?,?,?)`;
  await dal.executeAsync(sql, payload);
};

const create = async (googleUser) => {
  const payload = [googleUser.givenName, googleUser.familyName, googleUser.email];
  const sql = `INSERT INTO ${users}(uuid, firstName, lastName, userName)
  VALUES (UUID(), ?, ?,?)`;
  await dal.executeAsync(sql, payload);
}

const getGoogleUser = async (user) => {
  const payload = [user.email];
  const sql = `SELECT uuid, isAdmin, firstName, lastName, userName FROM ${users} 
  WHERE BINARY userName = ?`;
  const dbUser = await dal.executeAsync(sql, payload);
  return dbUser[0];
};

module.exports = {
  create,
  addUser,
  getUserDetails,
  isUserIdExist,
  getUserPassword,
  getGoogleUser
};
