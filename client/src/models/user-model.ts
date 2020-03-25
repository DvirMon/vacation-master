import Joi from 'joi'
import { handleMassage } from '../services/validationService';

export class UserModel {

  public constructor(
    public firstName?: string,
    public lastName?: string,
    public userName?: string,
    public password?: string,
    public isAdmin?: number
  ) { }


  static validLogin = (user: UserModel) => {

    const schema = Joi.object().keys({
      userName: Joi.string().min(3).max(10).error(errors => {
        errors.forEach(err => {
          handleMassage(err)
        })
        return errors;
      }),
      password: Joi.string().min(6).max(24).error(errors => {
        errors.forEach(err => {
          handleMassage(err)
        })
        return errors;
      }),
    }).unknown()

    const error = Joi.validate(user, schema).error;

    if (error) {
      return error.details[0].message
    }
    return null;
  };

}

export class RegisterModel {

  public constructor(
    public firstName?: string,
    public lastName?: string,
    public userName?: string,
    public password?: string,
  ) { }

  
  static validRegistration = (user: UserModel) => {

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
        userName: Joi.string().trim().min(3).max(10).error(errors => {
          errors.forEach(err => {
            handleMassage(err)
          })
          return errors;
        }),
        password: Joi.string().trim().min(8).max(24).regex(password).error(errors => {
          errors.forEach(err => {
            console.log()
            handleMassage(err)
          })
          return errors;
        }),
      }).unknown()
    const error = Joi.validate(user, schema).error
    if (error) {
      return error.details[0].message
    }
    return null;
  };
}

