const dal = require("../dal/dal");
const helpers = require("../helpers/helpers");
const followUpLogic = require("../bll/followup-logic");

const vacationFormat = `id as vacationID, description, destination, image,
DATE_FORMAT(startDate, '%Y-%m-%d') as startDate, 
DATE_FORMAT(endDate, '%Y-%m-%d') as endDate, price`;

// get all vacations
const getAllVacations = async () => {
  const sql = `SELECT ${vacationFormat} FROM vacations
   ORDER BY continentID ASC`;

  const vacations = await dal.executeAsync(sql);

  return vacations;
};

const getUnFollowedVacations = async userId => {
  const sql = `SELECT ${vacationFormat}
  FROM vacations as v 
  WHERE v.id NOT IN (
       SELECT f.vacationID
       FROM  followers as f 
       WHERE f.userID = ${userId})`;

  const unFollowed = await dal.executeAsync(sql);
  return unFollowed;
};

// delete vacation (admin only)
const deleteVacation = async id => {
  const sql = `DELETE FROM vacations WHERE id = ${id}`;
  await dal.executeAsync(sql);
  return;
};

// add new vacation (admin only)
const addVacation = async vacation => {
  const sql = `INSERT INTO vacations(description, destination, image, startDate, endDate, price)
  VALUES('${vacation.description}', '${vacation.destination}', '${vacation.image}', 
  '${vacation.startDate}', '${vacation.endDate}', ${vacation.price} )`;
  const info = await dal.executeAsync(sql);
  vacation.id = info.insertId;
  return vacation;
};

const uploadImage = async vacation => {
  const sql = `UPDATE vacations SET 
  image = '${vacation.image}', 
  WHERE id = ${vacation.id}`;
  const info = await dal.executeAsync(sql);

  return info.affectedRows === 0 ? null : vacation;
};

// update new vacation (admin only)
const updateVacation = async vacation => {
  const sql = `UPDATE vacations SET 
  description = '${vacation.description}', 
  destination = '${vacation.destination}', 
  image = '${vacation.image}', 
  startDate = '${vacation.startDate}', 
  endDate = '${vacation.endDate}',
  price = ${vacation.price}
  WHERE id = ${vacation.id}`;
  const info = await dal.executeAsync(sql);

  return info.affectedRows === 0 ? null : vacation;
};

// get vacations after login
const getUserVacations = async userID => {

  // get all vacations
  const unFollowup = await getUnFollowedVacations(userID);
  const followUp = await followUpLogic.getAllFollowUpByUser(userID);
  const vacations = {
    unFollowUp: unFollowup,
    followUp: followUp

  }
  return vacations;
};

module.exports = {
  getUserVacations,
  getAllVacations,
  addVacation,
  deleteVacation,
  updateVacation,
  uploadImage
};
