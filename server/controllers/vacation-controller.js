const express = require("express");
const vacationsLogic = require("../bll/vacation-logic");
const usersLogic = require("../bll/users-logic");
const VacationModel = require("../models/vacation-model");
const router = express.Router();
const auth = require("../services/auth");
const saveImageLocally = require("../services/image");

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
router.get("/user", auth.authorize(), async (request, response, next) => {
  try {
    const userName = request.user.sub;
    console.log(userName);

    // get user id from db
    const user = await usersLogic.isUserIdExist(userName);
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

// get  vacations
router.get("/:id", async (request, response, next) => {
  try {
    const vacationID = request.params.id;
    const vacation = await vacationsLogic.getVacation(vacationID);

    if (!vacation) {
      response.sendStatus(404);
    }

    response.json(vacation);
  } catch (err) {
    next(err);
  }
});

// add vacation (admin)
router.post("/", auth.authorize(1), async (request, response, next) => {
  const vacation = request.body;
  const error = VacationModel.validation(vacation);
  if (error) {
    response.status(400).json({ body: error, message: "error" });
    return;
  }

  try {
    const addedVacation = await vacationsLogic.addVacation(vacation);
    response.status(201).json({ body: addedVacation, message: "success" });
  } catch (err) {
    next();
  }
});

// update vacation (admin only)
router.put("/:id", async (request, response) => {
  // vacation id
  const vacationID = request.params.id;
  const vacation = request.body;
  const file = request.files.image;

  if (!file) {
    response.status(400).json("No Files Sent!");
    return;
  }
  const fileName = saveImageLocally(file);

  vacation.image = fileName;

  //validate schema
  const error = VacationModel.validation(vacation);
  if (error) {
    response.status(400).send({ body: error, message: "error" });
    return;
  }

  vacation.vacationID = vacationID;

  try {
    const updatedVacation = await vacationsLogic.updateVacation(vacation);
    if (updatedVacation === null) {
      response.sendStatus(404);
      return;
    }

    response.json({ body: updatedVacation, message: "success" });
  } catch (err) {
    response.status(500).json({ body: err, message: "error" });
  }
});

// delete vacation (admin only)
router.delete("/:id", auth.authorize(1), async (request, response) => {
  try {
    const id = request.params.id;
    await vacationsLogic.deleteVacation(id);
    response.sendStatus(204);
  } catch (err) {
    response.status(500).json(err.message);
  } 
});

// route for  getting images from the server
router.get("/uploads/:imgName", async (request, response, next) => {
  try {
    console.log(__dirname)
    const dirName = __dirname.substring(0, 44)
    response.sendFile(dirName + "\\uploads\\" + request.params.imgName);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
