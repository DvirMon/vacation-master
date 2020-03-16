
import Joi from "joi"

export const isRequired = (prop: string) => {
  const error = Joi.validate(prop, Joi.required()).error
  if (error) {
    return error.details[0].message
  }
  return null
}

 