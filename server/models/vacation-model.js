const Joi = require("joi");

class VacationModel {
  constructor(
    vacationID,
    description,
    destination,
    image,
    startDate,
    endDate,
    price
  ) {
    this.vacationID = vacationID;
    this.description = description;
    this.destination = destination;
    this.image = image;
    this.startDate = startDate;
    this.endDate = endDate;
    this.price = price;
  }

  // vacation validation schema with Joi
  static validation = vacation => {
    const schema = Joi.object().keys({
      description: Joi.string().max(1000).required(),
      destination: Joi.string().max(50).required(),
      image: Joi.required(),
      startDate: Joi.date().iso().required(),
      endDate: Joi.date().iso().greater(Joi.ref("startDate")).required(),
      price: Joi.number().min(1).required() 
    }).unknown()

    const error = Joi.validate(vacation, schema, { abortEarly: false }).error;

    if (error) {
      return error.details.map(err => err.message);
    }
    return null;
  }; 
}

module.exports = VacationModel;
