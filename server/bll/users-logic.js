const dal = require("../dal/dal");

// validate username (login/registration)
const getUserDetails = async (user) => {
  const sql = `SELECT uuid, isAdmin, firstName, lastName, userName FROM users 
  WHERE BINARY userName = '${user.userName}'`;
  const dbUser = await dal.executeAsync(sql);
  return dbUser[0];
};

// get password (login)
const getUserPassword = async (uuid) => {
  const sql = `SELECT password FROM users WHERE uuid = '${uuid}'`;
  const password = await dal.executeAsync(sql);
  return password[0];
};

// validate id (followup)
const isUserIdExist = async (uuid) => {
  const sql = `SELECT id FROM users WHERE uuid = '${uuid}'`;
  const id = await dal.executeAsync(sql);
  return id[0];
}; 

// add new user (registration)
const addUser = async (user) => {
  const sql = `INSERT INTO users(uuid, firstName, lastName, userName, password)
  VALUES (UUID(), '${user.firstName}', '${user.lastName}','${user.userName}','${user.password}')`;
  await dal.executeAsync(sql);
};

module.exports = {
  addUser,
  getUserDetails,
  isUserIdExist,
  getUserPassword,
};
