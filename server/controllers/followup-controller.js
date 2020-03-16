const express = require("express");
const followUpLogic = require("../bll/followup-logic");
const usersLogic = require("../bll/users-logic");
const router = express.Router();
const Helper = require("../helpers/helpers");

// add new followup
router.post("/", Helper.authorize(), async (request, response, next) => {
  try {
    // get vacationID uuid from request
    const followup = request.body;

    // get user uuid from token
    const userID = request.user.sub;

    // get user id from db
    const user = await usersLogic.isUserIdExist(userID);
    if (user.length > 0) {
      next("user is not exist in db");
      return;
    }

    followup.userID = user.id;
    const addedFollowup = await followUpLogic.addFollowUp(followup);

    addedFollowup.userID = userID;
    response.json(addedFollowup);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (request, response, next) => {
  try {
    const vacationID = request.params.id;
    const followers = await followUpLogic.getFollowUpByVacation(vacationID);
    if (!followers) {
      response.json(0);
      return
    }
    response.json(followers);
  } catch (err) {
    next(err);
  }
});

// delete followup
router.delete("/:id", Helper.authorize(), async (request, response, next) => {
  try {
    const id = request.params.id;
    await followUpLogic.deleteFollowUp(id);
    response.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
