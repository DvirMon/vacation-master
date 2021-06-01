require("dotenv").config();
const express = require("express");
const router = express.Router();

// import logic
const usersLogic = require("../business-logic-layer/users-logic");
const followUpLogic = require("../business-logic-layer/followup-logic");

// import auth
const UserModel = require("../models/user-model");
const bcrypt = require("bcryptjs");
const authService = require("../services/auth");
const { IdentityStore } = require("aws-sdk");

const key = config.jwt.actKey;

// get user followup vacations
router.get(
  "/followup",
  authService.authorize(0, key),
  async (request, response, next) => {
    try {
      const userName = request.user.sub;

      // validate id against db in case id is not exist
      const id = await usersLogic.isUserIdExist(userName);
      if (id.length > 0) {
        response.status(404).json("user is not exist in db");
        return;
      }

      const followups = await followUpLogic.getAllFollowUpByUser(id.id);

      response.json(followups);
    } catch (err) {
      next(err);
    }
  }
);
// enf od function

//---------------------------------------------- ---------------------------------------//

// add new user (register)
router.post("/", async (request, response, next) => {
  try {

    // valid user format
    const error = UserModel.validateRegistration(request.body);
    if (error) {
      next({ status: 400, error: error });
      return;
    }

    // valid userName in db
    const dbUser = await usersLogic.getUserDetails(request.body);
    if (dbUser) {
      next({ status: 409, message: "username is already taken" });
      return;
    }
    // hush password
    request.body.password = await authService.setPassword(request.body.password)

    // add new user to db
    await usersLogic.addUser(request.body);

    // return user from db
    const user = await usersLogic.getUserDetails(request.body);
    const jwt = await authService.setToken(user);

    response.status(201).json({ user, jwt });
  } catch (err) {
    next(err);
  }
});

//---------------------------------------------- ---------------------------------------//

// user login
router.post("/login", async (request, response, next) => {
  try {

    // valid user schema
    const error = UserModel.validateLogin(request.body);
    if (error) {
      next({ status: 400, error: error });
      return;
    }

    // valid username against database
    const user = await usersLogic.getUserDetails(request.body);
    if (!user) {
      next({ status: 409, message: "username or password are incorrect" });
      return;
    }

    // validate password against database
    const password = await usersLogic.getUserPassword(user.uuid);
    const validPassword = await bcrypt.compare(
      request.body.password,
      password.password
    );

    if (!validPassword) {
      next({ status: 409, message: "username or password are incorrect" });
      return;
    }

    const jwt = await authService.setToken(user);

    // return user info
    response.json({ user, jwt });

  } catch (err) {
    console.log(err)
    next(err);
  }
});

// user login with google
router.post("/login-google", async (request, response, next) => {
  try {

    let user

    const userProfile = request.body

    // is googleUser exist

    user = await usersLogic.getGoogleUser(userProfile)

    if (!user) {
      // create googleUser  
      user = await usersLogic.create(userProfile)

    }

    const jwt = await authService.setToken(user);

    response.json({ user, jwt });

  } catch (err) {
    console.log(err)
    next(err);
  }
});



module.exports = router;
