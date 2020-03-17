const Joi = require("joi");

class VacationModel {
  constructor(
    id,
    description,
    destination,
    continentID,
    image,
    startDate,
    endDate,
    price
  ) {
    this.id = id;
    this.description = description;
    this.destination = destination;
    this.continentID = continentID;
    this.image = image;
    this.startDate = startDate;
    this.endDate = endDate;
    this.price = price;
  }

  static validation = vacation => {
    const schema = Joi.object().keys({
      description: Joi.string().max(1000).required(),
      destination: Joi.string().max(50).required(),
      image: Joi.string().required(),
      startDate: Joi.date().iso().required(),
      endDate: Joi.date().iso().greater(Joi.ref("startDate")).required(),
      price: Joi.number().required()
    })

    const error = Joi.validate(vacation, schema, { abortEarly: false }).error;

    if (error) {
      return error.details.map(err => err.message);
    }
    return null;
  };
}

module.exports = VacationModel;
