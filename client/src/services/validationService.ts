
import Joi from "joi"
import { store } from "../redux/store/store"

// function for required input validation
export const isRequired = (prop: string) => {
  const error = Joi.validate(prop, Joi.required()).error
  if (error) {
    return error.details[0].message
  }
  return null
}
// end of function

// function for customized joi error message
export const handleMassage = (err) => {
  switch (err.type) {
    case "string.regex.base":
      if ((err.path[0]) === "password") {
        err.message = "password must contain at least one lowercase, uppercase and numeric character";
        break
      }
      err.message = "This field should only include a-z/A-Z letters";
      break
    case "any.empty":
      console.log(err.path[0])
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
      err.message = `Departing date cant be before ${err.context.limit.toISOString().slice(0, 10).replace("T", " ")}`;
      break
    case "number.base":
      err.message = `price is required`;
      break
  }
}
// end of function

// function to generate an object for joi
export const setObjectForSchema = (schema: {}, prop: string, input: string) => {
  schema[prop] = input;
  return schema;
};
// end of function


// function to check if error object contained errors
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
// end of function

// function to check if form's object contain all his values
export const formLegalValues = (obj) => {
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
export const formLegal = (obj, callback) => {

  const value = formLegalValues(obj);
  if (value) {
    alert(`Filed ${value} is required`);
    return true;
  }

  const schemeError = callback(obj)
  if (schemeError) {
    alert(schemeError)
    return true
  }

  return false;
}
// end of  function for legal form

//verify admin

export const verifyAdmin = (history) => {
  const user = store.getState().user;
  if (!user || user.isAdmin === 0) {
    alert("Not Admin");
    history.push("/login");
    return;
  }
}








