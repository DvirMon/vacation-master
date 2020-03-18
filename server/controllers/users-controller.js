require("dotenv").config();
const express = require("express");
const router = express.Router();

// import logic
const usersLogic = require("../bll/users-logic");
const followUpLogic = require("../bll/followup-logic");

// import helpers
const UserModel = require("../models/user-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const helpers = require("../helpers/helpers");

// get user followup vacations
router.get(
  "/followup",
  helpers.authorize(),
  async (request, response, next) => {
    try {
      const userID = request.user.id;

      // validate id against db in case id is not exist
      const id = await usersLogic.isUserIdExist(userID);
      if (id.length > 0) {
        next("user is not exist in db");
        return;
      }

      const followups = await followUpLogic.getAllFollowUpByUser(userID);
      response.json(followups);
    } catch (err) {
      next(err);
    }
  }
);

//---------------------------------------------- ---------------------------------------//

// validate user username (register)
router.post("/details", async (request, response, next) => {
  try {
    const userName = request.body;

    const dbUser = await usersLogic.isUserExist(userName);

    if (dbUser) {
      response.status(409).json("Username is already taken");
      return;
    }

    response.json(null);
  } catch (err) {
    next(err);
  }
});

// add new user (confirm)
router.post("/", async (request, response, next) => {
  try {

    const user = request.body;

    // valid user format
    const error = UserModel.validateRegistration(user);
    if (error) {
      response.status(404).json(error);
      return;
    }

    // valid userName in db
    const dbUser = await usersLogic.isUserExist(user.userName);
    if (dbUser) {
      response.status(409).json("Username is already taken");
      return;
    }

    // hush password
    user.password = await bcrypt.hash(user.password, 10);

    // add new user to db
    const addedUser = await usersLogic.addUser(user);

    // return user without password
    const newUser = await usersLogic.isUserExist(addedUser.userName)

    response.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

//---------------------------------------------- ---------------------------------------//

// user login
router.post("/login", async (request, response, next) => {
  try {
    const user = request.body;

    // valid user schema
    const error = UserModel.validateLogin(user);
    if (error) {
      response.status(404).json(error);
      return;
    }

    // validate user username against db
    const dbUser = await usersLogic.isUserExist(user.userName);

    if (!dbUser) {
      response.status(409).json("Username or password are incorrect");
      return;
    }
 
    // validate password from db
    const password = await usersLogic.getUserPassword(dbUser.userID)
    const validPassword = await bcrypt.compare(user.password, password.password);
    if (!validPassword) {
      response.status(409).json("Username or password are incorrect");
      return;
    }

    // return user info
    response.json(dbUser);
  } catch (err) {
    next(err);
  }
});


module.exports = router;
