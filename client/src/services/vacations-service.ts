import { VacationModel } from "../models/vacations-model";

import { ServerServices } from "./server-service";
import { ValidationService } from "./validation-service";

import { store } from "../redux/store";
import { ActionType } from "../redux/action-type";

// class to handle all vacation logic
export class VacationService {

  // get user vacations
  static getUserVacationAsync = async (accessToken) => {
    const url = `http://localhost:3000/api/vacations/user`;
    const response = await ServerServices.getDateAsync(url)
    return response 
  }
  //end of function

  // get all the users following a vacation
  static getFollowersByVacationAsync = async (vacationID) => {
    const url = `http://localhost:3000/api/followup/${vacationID}`;
    const response = await ServerServices.getDateAsync(url)
    return response
  }
  //end of function

  // add new followup vacation
  static addFollowUpAsync = async (vacationID, accessToken) => {
    const url = `http://localhost:3000/api/followup`;
    try {
      const response = await ServerServices.postRequest(url, { vacationID }, accessToken);
      return response
    } catch (err) {
      console.log(err);
    }
  };
  //end of function

  // delete followup vacation
  static deleteFollowUpAsync = async (id, accessToken) => {
    const url = `http://localhost:3000/api/followup/${id}`;
    try {
      await ServerServices.deleteRequest(url, accessToken);
    } catch (err) {
      console.log(err);
    }
  };
  //end of function

  // set FormData object for post and put request
  static setFormData = (vacation) => {
    const myFormData = new FormData();
    myFormData.append("description", vacation.description);
    myFormData.append("destination", vacation.destination);
    myFormData.append("startDate", vacation.startDate);
    myFormData.append("endDate", vacation.endDate);
    myFormData.append("price", vacation.price.toString());

    if (typeof vacation.image === "string") {
      myFormData.append("image", vacation.image);
    } else {
      myFormData.append("image", vacation.image, vacation.image.name);
    }
    return myFormData
  }
  // end of function
  
  
  // function to handle add followup 
  static handleAddFollowUp = async (vacation, accessToken) => {
    try {
      
      // add in database
      const addedVacation = await VacationService.addFollowUpAsync(
        vacation.vacationID,
        accessToken
      );

      // add follow up ID to new followed vacation
      vacation.followUpID = addedVacation.id;

      // add to store
      store.dispatch({ type: ActionType.addFollowUp, payload: vacation });

    } catch (err) {
      console.log(err)
    }
  }
  // end of function

  // function to handle delete followup logic
  static handleDeleteFollowUp = async (vacation, accessToken) => {
    try {

      // delete in database
      await VacationService.deleteFollowUpAsync(
        vacation.followUpID,
        accessToken
      );

      delete vacation.followUpID;

      // update store
      store.dispatch({
        type: ActionType.deleteFollowUp, payload: vacation
      });

    } catch (err) {
      console.log(err)
    }
  }
  // end of function

  // function to handle icon followup click
  static handleIconClick = async (vacation) => {
    const accessToken = store.getState().auth.tokens.accessToken;
    if (vacation.followUpID) {
      await VacationService.handleDeleteFollowUp(vacation, accessToken)
    } else {
      await VacationService.handleAddFollowUp(vacation, accessToken);
    }
  };
  // end of function

  
  static validVacationForm = (vacation) => {
    const valid = ValidationService.formLegal(
      vacation,
      VacationModel.validVacation
    );
    if (valid.msg) {
      alert(valid.body);
      return true
    }
  }


}
// end of vacation service
