const express = require("express");
const router = express.Router();

const followUpLogic = require("../bll/followup-logic");
const usersLogic = require("../bll/users-logic");
const auth = require("../services/auth");

const key = process.env.ACCESS_TOKEN_SECRET


// get all followup vacation and users for chart dataPoints
router.get("/", auth.authorize(1, key), async (request, response, next) => {
  try {
    const dataPoints = await followUpLogic.getAllFollowUp();
    response.json(dataPoints);
  } catch (err) {
    next(err);
  }
});

// get followers of vacation
router.get("/:id", async (request, response, next) => {
  try {
    const vacationID = request.params.id;
    const followers = await followUpLogic.getFollowUpByVacation(vacationID);
    if (!followers) {
      next({ status: 404 });
      return;    
    }
    response.json(followers);
  } catch (err) {
    next(err); 
  }
});

// add new followup
router.post("/", auth.authorize(0, key), async (request, response, next) => {
  try {
    // get vacation id from request
    const followup = request.body;

    // get username from token
    const userName = request.user.sub;
 
    // get user id from db
    const user = await usersLogic.isUserIdExist(userName);
    if (user.length > 0) {
      response.status(404).json("user is not exist in db");
      return;  
    }  

    followup.userID = user.id;

    const addedFollowup = await followUpLogic.addFollowUp(followup);

    response.json(addedFollowup);
  } catch (err) {
    next(err);
  }
});

// delete followup
router.delete("/:id", auth.authorize(0, key), async (request, response, next) => {
  try {
    const id = request.params.id;
    await followUpLogic.deleteFollowUp(id);
    response.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
