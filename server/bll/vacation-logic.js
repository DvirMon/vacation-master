const dal = require("../dal/dal");
const helpers = require("../helpers/helpers");
const followUpLogic = require("../bll/followup-logic");

const vacationFormat = `v.vacationID, description, destination, image,
DATE_FORMAT(startDate, '%Y-%m-%d') as startDate, 
DATE_FORMAT(endDate, '%Y-%m-%d') as endDate, price`;

// get all vacations
const getAllVacations = async () => {
 
  const sql = `SELECT ${vacationFormat} FROM vacations`;
  const vacations = await dal.executeAsync(sql);

  return vacations;
}
;
const getVacation = async (vacationID) => {

  const sql = `SELECT ${vacationFormat} FROM vacations as v WHERE vacationID = ${vacationID}`;
  const vacation = await dal.executeAsync(sql);

  return vacation[0];
};

const getUnFollowedVacations = async userID => {
  const sql = `SELECT ${vacationFormat}
  FROM vacations as v 
  WHERE v.vacationID NOT IN (
       SELECT f.vacationID
       FROM  followers as f 
       WHERE f.userID = ${userID})`;

  const unFollowed = await dal.executeAsync(sql);
  return unFollowed;
};

// delete vacation (admin only)
const deleteVacation = async id => {
  const sql = `DELETE FROM vacations WHERE vacationID = ${id}`;
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


// update new vacation (admin only)
const updateVacation = async vacation => {
  const sql = `UPDATE vacations SET 
  description = '${vacation.description}', 
  destination = '${vacation.destination}', 
  image = '${vacation.image}', 
  startDate = '${vacation.startDate}', 
  endDate = '${vacation.endDate}',
  price = ${vacation.price}
  WHERE vacationID = ${vacation.vacationID}`;
  const info = await dal.executeAsync(sql);
  console.log(info)
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
  getVacation,
  getAllVacations,
  addVacation,
  deleteVacation,
  updateVacation,
};
