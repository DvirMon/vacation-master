
import Joi from "joi"
import { store } from "../redux/store"

export class ValidationService {

    //verify admin 
    static verifyAdmin = (history) => {
      const admin = store.getState().login.admin;
      if (!admin) {
        alert("Not Admin");
        history.push("/login");
        return;
      } 
    }
    // end of function

  // function for required input validation
  static isRequired = (prop: string) => {
    const error = Joi.validate(prop, Joi.required()).error
    if (error) {
      return error.details[0].message
    }
    return null
  }
  // end of function


  // function to generate an object for joi
  static setObjectForSchema = (schema: {}, prop: string, input: string) => {
    schema[prop] = input;
    return schema;
  };
  // end of function

  // function to check if form's object contain all his values
  static formLegalValues = (obj) => {
    for (const value in obj) {
      if (obj[value] === undefined) {
        return value
      }
      else {
        continue
      }
    };
    return null
  }
  // end of function

  // function for legal form
  static formLegal = (obj, callback) => {

    const value = ValidationService.formLegalValues(obj);
    if (value) {
      return { body: `Filed ${value} is required`, msg: true }
    }

    const schemeError = callback(obj)
    if (schemeError) {
      return { body: schemeError, msg: true }
    }

    return { body: "", msg: false };
  }
  // end of function for legal form

}
// end of service


// function for customized joi error message
export const handleMassage = (err) => {
  switch (err.type) {
    case "string.regex.base":
      if ((err.path[0]) === "password") {
        err.message = "password must contain at least one lowercase, uppercase and numeric character";
        break
      }
      err.message = "This field should only include a-z/A-Z characters";
      break
    case "any.empty":
      if (err.path[0] === "firstName" || err.path[0] === "lastName") {
        err.message = "This field is required";
        break
      }
      err.message = `${err.path[0].toLowerCase()} is required`
      break
    case "string.min":
      err.message = `This field should be at last ${err.context.limit} characters`;
      break
    case "string.max":
      err.message = `This field must be less than or equal to ${err.context.limit} characters long}`;
      break
    case "date.ref":
      err.message = "Please choose departing date and only then returning date";
      break
    case "date.greater":
      err.message = `Returning date cant be before ${err.context.limit.toISOString().slice(0, 10).replace("T", " ")}`;
      break
    case "number.base":
      err.message = `price is required`;
      break
    case "number.unsafe":
      err.message = `price cannot be equal or less than 0`;
      break
    case "number.min":
      err.message = `price cannot be equal or less than 0`;
      break
  }
  
}
// end of function



