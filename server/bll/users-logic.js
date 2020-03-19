const dal = require("../dal/dal");


// validate username (login/registration)
const isUserExist = async userName => {
  const sql = `SELECT isAdmin, firstName, lastName, userName FROM users 
  WHERE BINARY userName = '${userName.trim()}'`;
  const dbUser = await dal.executeAsync(sql);
  return dbUser[0];
};

// get password (login)
const getUserPassword = async userName => {
  const sql = `SELECT password FROM users WHERE userName = '${userName}'`;
  const password = await dal.executeAsync(sql);
  return password[0];
};

// validate id (followup)
const isUserIdExist = async userName => {
  const sql = `SELECT id FROM users WHERE userName = '${userName}'`;
  const id = await dal.executeAsync(sql);
  return id[0]
};

// add new user (registration)
const addUser = async user => {
  const sql = `INSERT INTO users(userID, firstName, lastName, userName, password)
  VALUES (UUID(), '${user.firstName}', '${user.lastName}','${user.userName}','${user.password}')`;
  const info = await dal.executeAsync(sql);
  return user;
};

module.exports = {
  addUser,
  isUserExist,
  isUserIdExist,
  getUserPassword
};
