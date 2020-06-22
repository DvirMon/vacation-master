const express = require("express");
const router = express.Router();

const vacationsLogic = require("../business-logic-layer/vacation-logic");
const usersLogic = require("../business-logic-layer/users-logic");

const auth = require("../services/auth");
const imageService = require("../services/image");

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

// add vacation (admin)
router.post("/", auth.authorize(1, key), async (request, response, next) => {
  const vacation = request.body;
  const file = request.files;

  // verify file
  if (!file) {
    response.status(400).json("no file was sent");
    return;
  }

  // save file locally
  const fileName = imageService.saveImageLocally(file.image);

  vacation.image = fileName;

  // verify vacation schema
  const error = VacationModel.validation(vacation);
  if (error) {
    next({ status: 400, error: error });
    return;
  }

  try {
    const addedVacation = await vacationsLogic.addVacation(vacation);

    response.status(201).json(addedVacation);
  } catch (err) {
    next(err);
  }
});

// update vacation (admin only)
router.put("/:id", auth.authorize(1, key), async (request, response, next) => {
  try {
    const vacationID = request.params.id;
    const vacation = request.body;
    const file = request.files;

    // verify file
    if (file) {
      const fileName = imageService.saveImageLocally(file.image);
      vacation.image = fileName;
    } else if (vacation.image === undefined) {
      response.status(400).json("No image was sent!");
    }

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
});

// delete vacation (only admin)
router.delete(
  "/:id/:fileName",
  auth.authorize(1, key),
  async (request, response) => {
    try {
      const id = request.params.id;
      const fileName = request.params.fileName;

      await vacationsLogic.deleteVacation(id);
      imageService.deleteImageLocally(fileName);

      response.sendStatus(204);
    } catch (err) {
      response.status(500).json(err.message);
    }
  }
);

router.get("/update/image/:imgName", async (request, response, next) => {
  try {
    const imageName = request.params.imgName;
    const image = await imageService.readImage(imageName);
    response.sendFile(image);
  } catch (err) {
    next(err);
  }
});

// route for  getting images from the server
router.get("/uploads/:imgName", async (request, response, next) => {
  try {
    const path = process.cwd();
    response.sendFile(path + "\\uploads\\" + request.params.imgName);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
