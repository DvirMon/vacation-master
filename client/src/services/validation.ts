
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

//   message: ""endDate" must be greater than "Mon Mar 09 2020 23:46:00 GMT+0200 (שעון ישראל (חורף))""
// path: ["endDate"]
// type: "date.greater"
// context:
// limit: Mon Mar 09 2020 23:46:00 GMT+0200 (שעון ישראל (חורף)) {}
// value: Sun Mar 01 2020 23:46:00 GMT+0200 (שעון ישראל (חורף)) {}
// key: "endDate"
// label: "endDate"



export const setObjectForSchema = (schema: {}, prop: string, input: string) => {
  schema[prop] = input;
  return schema;
};


