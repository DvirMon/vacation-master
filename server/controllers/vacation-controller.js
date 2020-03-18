const express = require("express");
const vacationsLogic = require("../bll/vacation-logic");
const usersLogic = require("../bll/users-logic");
const VacationModel = require("../models/vacation-model");
const router = express.Router();
const helpers = require("../helpers/helpers");

// get all vacations
router.get("/", async (request, response, next) => {
  try {
    const vacations = await vacationsLogic.getAllVacations();
    response.json(vacations);
  } catch (err) {
    next(err);
  }
});

//get users vacation
router.get("/user", helpers.authorize(), async (request, response, next) => {
  try {
    const userID = request.user.sub;

    // get user id from db
    const user = await usersLogic.isUserIdExist(userID);
    if (user.length > 0) {
      next("user is not exist in db");
      return;
    }

    const vacations = await vacationsLogic.getUserVacations(user.id);

    response.json(vacations);
  } catch (err) {
    next(err);
  }
});

// only admin
router.post("/", helpers.authorize(1), async (request, response, next) => {
 
  const vacation = request.body;
  const error = VacationModel.validation(vacation);

  if (error) {
    response.status(400).json(error);
    return;
  }

  try {
    const addedVacation = await vacationsLogic.addVacation(vacation);
    response.status(201).json(addedVacation);

  } catch (err) {
    next();
  }
});

// update vacation (admin only)
router.put("/:id", helpers.authorize(1), async (request, response) => {
  // vacation id

  const id = request.params.id;

  const vacation = request.body;

  vacation.id = id;

  const error = VacationModel.validation(vacation);

  if (error) {
    response.status(400).send(error);
    return;
  }

  try {
    const updatedVacation = await vacationsLogic.updateVacation(vacation);

    if (updatedVacation === null) {
      response.sendStatus(404);
      return;
    }

    response.json(updatedVacation);
  } catch (err) {
    response.status(500).json(err.message);
  }
});

// delete vacation (admin only)
router.delete("/:id", helpers.authorize(1), async (request, response) => {
  try {
    const id = request.params.id;
    await vacationsLogic.deleteVacation(id);
    response.sendStatus(204);
  } catch (err) {
    response.status(500).json(err.message);
  }
});

router.post("/upload-image", async (request, response, next) => {
  try {
    
    if (!request.files) {
      console.log("No Files Sent");
      response.status(400).json("No Files Sent!");
      return;
    }
    const image = request.files.image; 

    const fileName = helpers.saveImageLocally(image);

    response.json(fileName);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
