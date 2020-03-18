import Joi from 'joi'
import { handleMassage } from '../services/validation';



export class VacationModel {

  constructor(
    public destination?: string,
    public price?: number, 
    public image?: string,
    public startDate?: string,
    public endDate?: string,
    public description?: string
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

    const error = Joi.validate(vacation, schema).error;
    if (error) {
      return error.details[0].message
    }
    return null;
  };
}

export class UserVacationModel extends VacationModel{

  constructor(
    public followUpID?: number,
    public vacationID?: number,
    destination?: string,
    price?: number,
    image?: string,
    startDate?: string,
    endDate?: string, 
    description?: string
  ) {
    super(destination, price, image, startDate, endDate, description)
  }

} 

export class FollowUpModel {

  constructor(
    public vacationID?: number,
    public userID?: string,
  ) { }

}