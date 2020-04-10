import Joi from 'joi'
import { handleMassage } from '../services/validationService';



export class VacationModel {

  constructor(
    public destination?: string,
    public price?: number,
    public startDate?: string,
    public endDate?: string,
    public description?: string,
    public image?: File
  ) {

  }

  static validVacation = (vacation: VacationModel): string => {

    const schema = Joi.object().keys({
      destination: Joi.string().max(50).error(errors => {
        errors.forEach(err => handleMassage(err))
        return errors;
      }),
      description: Joi.string().max(1000).error(errors => {
        errors.forEach(err => handleMassage(err))
        return errors;
      }),
      startDate: Joi.date().iso().error(errors => {
        errors.forEach(err => handleMassage(err))
        return errors;
      }),
      endDate: Joi.date().iso().greater(Joi.ref("startDate")).error(errors => {
        errors.forEach(err => handleMassage(err))
        return errors;
      }),
      price: Joi.number().min(1).error(errors => {
        errors.forEach(err => handleMassage(err))
        return errors;
      })
    }).unknown()

    const error = Joi.validate(vacation, schema).error;
    if (error) {
      console.log(error.details[0])
      return error.details[0].message
    }
    return null;
  };
}

export class UserVacationModel extends VacationModel {

  constructor(
    public followUpID?: number,
    public vacationID?: number,
    destination?: string,
    price?: number,
    startDate?: string,
    endDate?: string,
    description?: string,
    image?: File
  ) {
    super(destination, price, description, startDate, endDate, image)
  }

}

export class FollowUpModel {
  constructor(
    public vacationID: number,
    public userID: string,
  ) { } 

}

export class Notification {
  constructor(
    public vacationID: number,
    public msg: string, 
  ) { }

}