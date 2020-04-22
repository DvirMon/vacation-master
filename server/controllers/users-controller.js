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

const key = process.env.ACCESS_TOKEN_SECRET


// get user followup vacations
router.get("/followup", auth.authorize(0, key),async (request, response, next) => {
   
  try { 

      const userName = request.user.sub

      // validate id against db in case id is not exist
      const id = await usersLogic.isUserIdExist(userName);
      if (id.length > 0) {
        next("user is not exist in db");
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
      response.status(409).json("username is already taken");
      return;
    }
    // hush password
    user.password = await bcrypt.hash(user.password, 10);

    // add new user to db
    const addedUser = await usersLogic.addUser(user);

    // return user without password
    const newUser = await usersLogic.isUserExist(addedUser.uuid)

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
      
    // get username and from database
    const dbUser = await usersLogic.isUserExist(user.userName);
    if (!dbUser) {
      response.status(409).json("username or password are incorrect");
      return;
    }

    // validate password from database
    const password = await usersLogic.getUserPassword(dbUser.uuid)
    const validPassword = await bcrypt.compare(user.password, password.password);
    
    if (!validPassword) {
      response.status(409).json("username or password are incorrect");
      return;
    }

    // return user info
    response.json(dbUser);
  } catch (err) {
    next(err);
  }
});


module.exports = router; 
 