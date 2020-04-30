const dal = require("../dal/dal");

const addFollowUp = async followup => {
  const payload = [followup.vacationID, followup.userID ]
  const sql = `INSERT INTO followers(vacationID, userID)
                VALUES (?, ?)`;
  const info = await dal.executeAsync(sql, payload);
  followup.id = info.insertId;
  return followup;
};
 
const deleteFollowUp = async id => {
  const payload = [id]
  const sql = `DELETE FROM followers WHERE id = ?`;
  await dal.executeAsync(sql, payload);
  return;
};

//
const getAllFollowUpByUser = async userID => {
  const payload = [userID]
  const sql = `SELECT f.id as followUpID, v.vacationID, description, destination, image,
   DATE_FORMAT(startDate, '%Y-%m-%d') as startDate, 
   DATE_FORMAT(endDate, '%Y-%m-%d') as endDate, price
FROM vacations as v JOIN followers as f 
ON f.vacationID = v.vacationID
AND f.userID = ?`;
  const followups = await dal.executeAsync(sql, payload);
  return followups;
};

// get all followup vacations for chart
const getAllFollowUp = async () => {
  const sql = `SELECT  vacationID as label, COUNT(userID) as y
  FROM followers as f
  GROUP BY vacationID`;
  const followups = await dal.executeAsync(sql);
  return followups;
};
const getFollowUpByVacation = async (vacationID) => {
  const payload = [vacationID]
  const sql = `SELECT COUNT(userID) as followers
  FROM followers
  WHERE vacationID = ?
  GROUP BY vacationID`;
  const followups = await dal.executeAsync(sql, payload);
  return followups[0];
};

module.exports = {
  getAllFollowUpByUser,
  getFollowUpByVacation,
  getAllFollowUp,
  addFollowUp,
  deleteFollowUp
};
