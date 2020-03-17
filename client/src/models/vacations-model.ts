import Joi from 'joi'


export class VacationModel {

  constructor(
    public followUpID?: number,
    public vacationID?: number,
    public description?: string,
    public destination?: string,
    public continentID?: number,
    public image?: string,
    public startDate?: string,
    public endDate?: string,
    public price?: number
  ) {

  }

  static validation = (vacation : VacationModel) => {
    
    const schema = Joi.object().keys({
      description: Joi.string().max(1000),
      destination: Joi.string().max(50),
      image: Joi.string(),
      startDate: Joi.date().iso(),
      endDate: Joi.date().iso().greater(Joi.ref("startDate")),
      price: Joi.number()
    })

    const error = Joi.validate(vacation, schema, { abortEarly: false }).error;

    if (error) {
      return error.details.map(err => err.message);
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