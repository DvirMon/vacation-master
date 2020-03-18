import Joi from 'joi'
import { handleMassage } from '../services/validation';


export class VacationModel {

  constructor(
    public followUpID?: number,
    public vacationID?: number,
    public description?: string,
    public destination?: string,
    public image?: string,
    public startDate?: string,
    public endDate?: string,
    public price?: number
  ) {

  }

  static validVacation = (vacation: VacationModel): string => {

    // const pattern = /^[a-zA-Z ]$/;

    const schema = Joi.object().keys({
      destination: Joi.string().max(50),
      description: Joi.string().max(1000),
      image: Joi.string(),
      startDate: Joi.date().iso(),
      endDate: Joi.date().iso().greater(Joi.ref("startDate")).error(errors => {
        errors.forEach(err => {
          handleMassage(err)
        })
        return errors;
      }),
      price: Joi.number()
    }).unknown()
 
    const error = Joi.validate(vacation, schema, { abortEarly: false }).error;
    if (error) {
      console.log(error.details)
      return error.details[0].message
    }
    return null;
  };


}

export class UserVacationsModel {

  constructor(
    public unFollowed?: VacationModel[],
    public followUp?: VacationModel[],
  ) { }

}

export class FollowUpModel {

  constructor(
    public vacationID?: number,
    public userID?: string,
  ) { }

}