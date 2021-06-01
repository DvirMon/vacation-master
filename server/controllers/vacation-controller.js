const express = require("express");
const router = express.Router();

const vacationsLogic = require("../business-logic-layer/vacation-logic");
const usersLogic = require("../business-logic-layer/users-logic");

const auth = require("../services/auth");
const handleImage = require("../services/upload");

const VacationModel = require("../models/vacation-model");

const key = config.jwt.actKey;



// get all vacations
router.get("/", async (request, response, next) => {
  try {
    const vacations = await vacationsLogic.getAllVacations();
    response.json(vacations);
  } catch (err) {
    next(err);
  }
});
// end of function

//get users vacation
router.get("/user", auth.authorize(0, key), async (request, response, next) => {
  try {
    const uuid = request.user.sub;
    // get user id from db
    const user = await usersLogic.isUserIdExist(uuid);
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
// end of function

// get  vacations
router.get("/:id", async (request, response, next) => {
  try {
    const vacationID = request.params.id;

    const vacation = await vacationsLogic.getVacation(vacationID);

    if (!vacation) {
      next({ status: 404 });
    }

    response.json(vacation);
  } catch (err) {
    next(err);
  }
});
// end of function 

const multer = require("multer")
const upload = multer()

// add vacation (admin)
router.post(
  "/",
  auth.authorize(1, key),
  handleImage.upload, 
  async (request, response, next) => {

    // verify vacation schema
    const error = VacationModel.validation(request.body);
    if (error) {
      next({ status: 400, error: error });
      return;
    }

    try {
      const addedVacation = await vacationsLogic.addVacation(request.body);

      response.status(201).json(addedVacation);
    } catch (err) {
      next(err);
    }
  }
);

// update vacation (admin only)
router.put(
  "/:id",
  auth.authorize(1, key),
  handleImage.upload,
  async (request, response, next) => {
    try {
      const vacationID = request.params.id;
      const vacation = request.body;

      //verify schema
      const error = VacationModel.validation(vacation);
      if (error) {
        response.status(404).json(error);
        return;
      }

      vacation.vacationID = vacationID;

      // request for update
      const updatedVacation = await vacationsLogic.updateVacation(vacation);

      // verify update
      if (updatedVacation === null) {
        response.status(404).json("Item is not in database");
        return;
      }

      // change id from string to number
      updatedVacation.vacationID = +vacationID;

      response.json(updatedVacation);
    } catch (err) {
      next(err);
    }
  }
);

// delete vacation (only admin)
router.delete(
  "/:id/:fileName",
  auth.authorize(1, key), 
  async (request, response) => {
    try {
      const id = request.params.id;
      const fileName = request.params.fileName;

      await handleImage.deleteImage(fileName)
      await vacationsLogic.deleteVacation(id);

      response.sendStatus(204);
    } catch (err) {
      response.status(500).json(err.message);
    }
  }
);


module.exports = router;
