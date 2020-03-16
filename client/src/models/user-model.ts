import Joi from 'joi'

export class UserModel {

  public constructor(public userID?: string, public firstName?: string, public lastName?: string,
    public userName?: string, public password?: string, public isAdmin?: number
  ) { }


  static validLogin = (user: UserModel) => {

    const schema = Joi.object().keys({
      userName: Joi.string().min(3).max(10).required(),
      password: Joi.string().min(6).max(10).required()
    }).unknown()

    const error = Joi.validate(user, schema, { abortEarly: false }).error;

    if (error) {
      return error.details.map(err => err.message);
    }
    return null;
  };



  static validRegistration = user => {

    const name = /^[a-zA-Z]{3,25}$/;
    var password = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])");

    const schema = Joi.object()
      .keys({
        firstName: Joi.string().trim().min(3).regex(name).error(errors => {
          errors.forEach(err => {
            handleMassage(err)
          })
          return errors;
        }),
        lastName: Joi.string().trim().min(3).regex(name).error(errors => {
          errors.forEach(err => {
            handleMassage(err)
          })
          return errors;
        }),
        userName: Joi.string().trim().min(4).max(10),
        password: Joi.string().trim().min(8).max(24).regex(password).error(errors => {
          errors.forEach(err => {
            handleMassage(err)
          })
          return errors;
        }),
      })

    const handleMassage = (err) => {
      switch (err.type) {
        case "string.regex.base":
          if ((err.path[0]) === "password") {
            err.message = "password must contain at least a lowercase, an uppercase and numeric character";
            break
          }
          err.message = "field should only include a-z/A-Z letters";
          break
      }

    }

    const error = Joi.validate(user, schema).error
    if (error) {
      return error.details[0].message
    }
    return null;
  };
}

