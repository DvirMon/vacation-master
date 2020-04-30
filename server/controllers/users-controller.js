require("dotenv").config();
const express = require("express");
const router = express.Router();

// import logic
const usersLogic = require("../bll/users-logic");
const followUpLogic = require("../bll/followup-logic");

// import auth
const UserModel = require("../models/user-model");
const bcrypt = require("bcryptjs");
const auth = require("../services/auth");

const key = config.jwt.actKey;

// get user followup vacations
router.get(
  "/followup",
  auth.authorize(0, key),
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
      next({ status: 409 });
      return;
    }
    // hush password
    request.body.password = await bcrypt.hash(request.body.password, 10);
 
    // add new user to db
    await usersLogic.addUser(request.body);

    // return user from db
    const user = await usersLogic.getUserDetails(request.body);
    const jwt = await auth.setToken(user);

    response.status(201).json({user, jwt});
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
      next({ status: 409 });
      return;
    }

    // validate password against database
    const password = await usersLogic.getUserPassword(user.uuid);
    const validPassword = await bcrypt.compare(
      request.body.password,
      password.password
    );

    if (!validPassword) {
      next({ status: 409 });
      return;
    }

    const jwt = await auth.setToken(user);
 
    // return user info
    response.json({ user, jwt });

  } catch (err) { 
    next(err);
  }
});

module.exports = router;
