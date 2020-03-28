const Joi = require("@hapi/joi");

class UserModel {
  constructor(id, userID, firstName, lastName, username, password, isAdmin) {
    this.id = id;
    this.userID = userID;
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.password = isAdmin;
    this.isAdmin = isAdmin;
  }

  // validation schema for registration
  static validateRegistration = user => {
    const pattern = /^[a-zA-Z ]{3,25}$/;
    const password = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])");

    const schema = Joi.object().keys({
      firstName: Joi.string()
        .trim()
        .regex(pattern)
        .min(3)
        .required(),
      lastName: Joi.string()
        .trim()
        .regex(pattern)
        .min(3)
        .required(),
      userName: Joi.string()
        .trim()
        .min(3)
        .max(10)
        .required(),
      password: Joi.string()
        .trim()
        .min(8)
        .max(24)
        .regex(password)
        .required()
    });

    const error = schema.validate(user, { abortEarly: false }).error;

    if (error) {
      return error.details.map(err => err.message);
    }
    return null;
  };
  // end of function

  // validation schema for login
  static validateLogin = user => {
    const schema = Joi.object()
      .keys({
        userName: Joi.string()
          .min(3)
          .max(10)
          .required(),
        password: Joi.string()
          .min(6)
          .max(24)
          .required()
      })
      .unknown();

    const error = schema.validate(user, { abortEarly: false }).error;

    if (error) {
      return error.details.map(err => err.message);
    }
    return null;
  };
  // validation schema for login
}

module.exports = UserModel;
