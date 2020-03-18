
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
    case "date.ref":
      err.message = "Please choose the start date before";
      break
    case "date.greater":
      err.message = `This date must be greater then ${err.context.limit.toISOString().slice(0, 10).replace("T", " ")}`;
      break
  }
}


export const setObjectForSchema = (schema: {}, prop: string, input: string) => {
  schema[prop] = input;
  return schema;
};


export const formLegalErrors = (errors) => {

  for (const error in errors) {
    if (errors[error].length > 0) {
      return errors[error]
    } else {
      continue
    }
  }
  return null
}

export const formLegalValues = (obj) => {
  for (const value in obj) {
    if (obj[value] === undefined)
      return value
  }
  return null
};



