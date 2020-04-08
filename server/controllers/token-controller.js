require("dotenv").config();
const express = require("express");
const router = express.Router();

// import logic
const tokenLogic = require("../bll/tokens-logic");

// import auth
const jwt = require("jsonwebtoken");
const auth = require("../services/auth");

// set refreshToken and first accessToken when login
router.post("/", async (request, response, next) => {
  const user = request.body;

  try {
    // create accessToken for user
    const accessToken = await auth.setToken(user);

    // create refreshToken for user
    const refreshToken = await auth.setRefreshToken(user);

    // save refreshToken in db
    const dbToken = await tokenLogic.addToken({ refreshToken });

    response.status(201).json({ body: {dbToken, accessToken }, message: "success" });
  } catch (err) {
    next(err);
  }
});

// get new token
router.post("/new", auth.authorize(), async (request, response, next) => {
  try {
    // get refreshToken from client
    const dbToken = request.body;

    // validate refreshToken in db
    const refreshToken = await tokenLogic.getDatabaseToken(dbToken.id);
    if (!refreshToken) {
      response.status(404).json({ message : "error", body : "token is invalid"});
      return;
    }

    // verify token
    const verify = jwt.verify(
      dbToken.refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    if (!verify) {
      response.sendStatus(403);
      return;
    }

    // generate new accessToken
    const accessToken = await auth.setToken({
      userName: verify.sub,
      isAdmin: verify.role,
    });

    response 
      .status(201)
      .json({ message: "success", body: { dbToken, accessToken } });
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
