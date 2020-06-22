const dal = require("../dal/dal");
const followUpLogic = require("../business-logic-layer/followup-logic");

const vacationFormat = `v.vacationID, description, destination, image,
DATE_FORMAT(startDate, '%Y-%m-%d') as startDate, 
DATE_FORMAT(endDate, '%Y-%m-%d') as endDate, price`;

// get all vacations
const getAllVacations = async () => {
  const sql = `SELECT ${vacationFormat} FROM vacations`;
  const vacations = await dal.executeAsync(sql);

  return vacations;
};
const getVacation = async (vacationID) => {
  const payload = [vacationID];
  const sql = `SELECT description, destination, image,
  DATE_FORMAT(startDate, '%Y-%m-%d') as startDate, 
  DATE_FORMAT(endDate, '%Y-%m-%d') as endDate, price FROM vacations as v WHERE vacationID = ?`;
  const vacation = await dal.executeAsync(sql, payload);

  return vacation[0];
};

const getUnFollowedVacations = async (userID) => {
  const payload = [userID];
  const sql = `SELECT ${vacationFormat}
  FROM vacations as v 
  WHERE v.vacationID NOT IN (
    SELECT f.vacationID
    FROM  followers as f 
    WHERE f.userID = ?)`;

  const unFollowed = await dal.executeAsync(sql, payload);
  return unFollowed;
};

// delete vacation (admin only)
const deleteVacation = async (id) => {
  const payload = [id];

  const sql = `DELETE FROM vacations WHERE vacationID = ?`;
  await dal.executeAsync(sql, payload);
  return;
};

// add new vacation (admin only)
const addVacation = async (vacation) => {
  const payload = [
    vacation.description,
    vacation.destination,
    vacation.image,
    vacation.startDate,
    vacation.endDate,
    vacation.price,
  ];
  const sql = `INSERT INTO vacations(description, destination, image, startDate, endDate, price) 
              VALUES(?, ?, ?, ?, ?,?)`;
  const info = await dal.executeAsync(sql, payload);
  vacation.vacationID = info.insertId;
  return vacation;
};

// update new vacation (admin only)
const updateVacation = async (vacation) => {
  const payload = [
    vacation.description,
    vacation.destination,
    vacation.image,
    vacation.startDate,
    vacation.endDate,
    vacation.price,
    vacation.vacationID,
  ];
  const sql = `UPDATE vacations SET 
  description = ?, 
  destination = ?, 
  image = ?, 
  startDate = ?, 
  endDate = ?,
  price =?  WHERE vacationID = ?`;
  const info = await dal.executeAsync(sql, payload);
  return info.affectedRows === 0 ? null : vacation;
};

// get vacations after login
const getUserVacations = async (userID) => {
  // get all vacations
  const unFollowup = await getUnFollowedVacations(userID);
  const followUp = await followUpLogic.getAllFollowUpByUser(userID);
  const vacations = {
    unFollowUp: unFollowup,
    followUp: followUp,
  };
  return vacations;
};

module.exports = {
  getUserVacations,
  getVacation,
  getAllVacations,
  addVacation,
  deleteVacation,
  updateVacation,
};
