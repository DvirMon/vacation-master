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

  static validateRegistration = user => {
    const pattern = /^[a-zA-Z]{3,25}$/;

    const schema = Joi.object()
      .keys({
        firstName: Joi.string().trim().regex(pattern).min(3).required(),
        lastName: Joi.string().trim().regex(pattern).min(3).required(),
        userName: Joi.string().trim().min(3).max(10).required(),
        password: Joi.string().trim().min(8).max(24).required()
      })

    const error = schema.validate(user, { abortEarly: false }).error;

    if (error) {
      return error.details.map(err => err.message);
    }
    return null;
  };

  static validateLogin = user => {

    const schema = Joi.object()
      .keys({
        userName: Joi.string().min(3).max(10).required(),
        password: Joi.string().min(6).max(10).required()
      })

    const error = schema.validate(user, { abortEarly: false }).error;

    if (error) {
      return error.details.map(err => err.message);
    }
    return null;
  };
}

module.exports = UserModel;
