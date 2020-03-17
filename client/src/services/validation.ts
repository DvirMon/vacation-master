
import Joi from "joi"

export const isRequired = (prop: string) => {
  const error = Joi.validate(prop, Joi.required()).error
  if (error) {
    return error.details[0].message
  }
  return null
}

export const handleMassage = (err) => {
  switch (err.type) {
    case "string.regex.base":
      if ((err.path[0]) === "password") {
        err.message = "password must contain at least a lowercase, an uppercase and numeric character";
        break
      }
      err.message = "field should only include a-z/A-Z letters";
      break
    case "any.empty":
      err.message = "field must be filled";
      break
  }

}

export const setObjectForSchema = (prop: string, input: string) => {
  const user = {};
  user[prop] = input;
  return user;
};


