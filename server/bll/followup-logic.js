const dal = require("../dal/dal");

const addFollowUp = async followup => {
  const sql = `INSERT INTO followers(vacationID, userID)
                VALUES (${followup.vacationID}, ${followup.userID})`;
  const info = await dal.executeAsync(sql);
  followup.id = info.insertId;
  return followup;
};

const deleteFollowUp = async id => {
  const sql = `DELETE FROM followers WHERE id = ${id}`;
  await dal.executeAsync(sql);
  return;
};
  
//
const getAllFollowUpByUser = async userID => {
  const sql = `SELECT f.id as followUpID, v.vacationID, description, destination, image,
   DATE_FORMAT(startDate, '%Y-%m-%d') as startDate, 
   DATE_FORMAT(endDate, '%Y-%m-%d') as endDate, price
FROM vacations as v JOIN followers as f 
ON f.vacationID = v.vacationID
AND f.userID = ${userID}`;
  const followups = await dal.executeAsync(sql);
  return followups;
};

// get all followup vacations for chart
const getAllFollowUp = async () => {
  sql = `SELECT  vacationID as label, COUNT(userID) as y
  FROM followers as f
  GROUP BY vacationID`;
  const followups = await dal.executeAsync(sql);
  return followups;
};
const getFollowUpByVacation = async (vacationID) => {
  sql = `SELECT COUNT(userID) as followers
  FROM followers
  WHERE vacationID = ${vacationID}
  GROUP BY vacationID`;
  const followups = await dal.executeAsync(sql);
  return followups[0];
};

module.exports = {
  getAllFollowUpByUser,
  getFollowUpByVacation,
  getAllFollowUp,
  addFollowUp,
  deleteFollowUp
};
