require("dotenv").config();
const express = require("express");
const router = express.Router();

// import logic
const tokenLogic = require("../bll/tokens-logic");

// import helpers
const jwt = require("jsonwebtoken");
const helpers = require("../helpers/helpers");

// set refreshToken and first accessToken when login 
router.post("/", async (request, response, next) => {

  const user = request.body;
  try {
    // create accessToken for user
    const accessToken = await helpers.setToken(user);

    // create refreshToken for user
    const refreshToken = await helpers.refreshToken(user);

    const token = {
      refreshToken : refreshToken
    }
    // save refreshToken in db
    const dbToken = await tokenLogic.addToken(token);

    response.status(201).json({accessToken, dbToken});
  } catch (err) {
    next(err);
  }
});

// get new token
router.post("/new", async (request, response, next) => {
  try {
    // get refreshToken from client
    const refreshToken = request.body.refreshToken;

    // validate refreshToken in db
    const dbToken = await tokenLogic.getToken(refreshToken);
    if (!dbToken) {
      response.sendStatus(403);
      return;
    }

    // get token info
    const verify = jwt.verify(
      dbToken.refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    if (!verify) {
      response.sendStatus(403);
      return;
    }

    // generate new accessToken
    const accessToken = await helpers.setToken({
      userID: verify.sub,
      isAdmin: verify.role
    });

    response.json(accessToken);
  } catch (err) {
    next(err);
  }
});

// logout
router.delete("/:id", async (request, response, next) => {
  try {
    // get refreshToken id from client
    const id = request.params.id;

    // delete refreshToken from db
    await tokenLogic.deleteToken(id);
    response.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
