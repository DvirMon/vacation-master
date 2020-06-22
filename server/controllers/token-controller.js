require("dotenv").config();
const express = require("express");
const router = express.Router();

// import logic
const tokenLogic = require("../business-logic-layer/tokens-logic");

// import auth
const jwt = require("jsonwebtoken");
const auth = require("../services/auth");

const actKey = config.jwt.actKey;
const refKey = config.jwt.refKey;

// set refreshToken when login
router.post("/", auth.authorize(0, actKey), async (request, response, next) => {
  const payload = request.user;
  try {
    // create refreshToken for user
    const refreshToken = await auth.setRefreshToken({
      uuid: payload.sub,
      isAdmin: payload.role,
    });
    // save refreshToken in db
    const dbToken = await tokenLogic.addToken({ refreshToken });
    response.status(201).json(dbToken);
  } catch (err) {
    next(err);
  }
});

// get new access token
router.post("/new", auth.authorize(0, refKey), async (request, response, next) => {
  try {
    // get refreshToken from client
    const dbToken = request.body;

    // validate refreshToken in db
    const refreshToken = await tokenLogic.getDatabaseToken(dbToken.id);
    if (!refreshToken) {
      response.status(401).json("token is invalid");
      return;
    }

    // verify token
    const payload = jwt.verify(
      dbToken.refreshToken,
      config.jwt.refKey
    );

    if (!payload) {
      next({ status: 403 });
      return;
    }
    // generate new accessToken
    const accessToken = await auth.setToken({
      uuid: payload.sub,
      isAdmin: payload.role,
    });

    response.status(201).json(accessToken);
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
