import { VacationModel } from "../models/vacations-model";

import { ServerServices } from "./server-service";
import { ValidationService } from "./validation-service";

import { store } from "../redux/store";
import { ActionType } from "../redux/action-type";

// class to handle all vacation logic
export class VacationService {

  // get user vacations
  static getUserVacationAsync = async () => {
    const url = `http://localhost:3000/api/vacations/user`;
    const response = await ServerServices.getRequestAsync(url)
    return response
  }
  //end of function

  // get all the users following a vacation
  static getFollowersByVacationAsync = async (vacationID) => {
    const url = `http://localhost:3000/api/followup/${vacationID}`;
    const response = await ServerServices.getRequestAsync(url)
    return response
  }
  //end of function

  // add new followup vacation 
  static addFollowUpAsync = async (vacationID) => {
    const url = `http://localhost:3000/api/followup`;
    try {
      const response = await ServerServices.postRequestAsync(url, { vacationID });
      return response
    } catch (err) {
      console.log(err);
    }
  };
  //end of function

  // delete followup vacation
  static deleteFollowUpAsync = async (id) => {
    const url = `http://localhost:3000/api/followup/${id}`;
    try {
      await ServerServices.deleteRequestAsync(url);
    } catch (err) {
      console.log(err);
    }
  };
  //end of function

  // function to handle add followup 
  static handleAddFollowUp = async (vacation) => {
    try {

      // add to database
      const addedFollowup = await VacationService.addFollowUpAsync(vacation.vacationID);

      // add follow up ID to new followed vacation
      vacation.followUpID = addedFollowup.id;

      // add to store
      store.dispatch({ type: ActionType.addFollowUp, payload: vacation });

    } catch (err) {
      console.log(err)
    }
  }
  // end of function

  // function to handle delete followup logic
  static handleDeleteFollowUp = async (vacation) => {
    try {

      // delete in database
      await VacationService.deleteFollowUpAsync(vacation.followUpID);

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
    if (vacation.followUpID) {
      await VacationService.handleDeleteFollowUp(vacation)
    } else {
      await VacationService.handleAddFollowUp(vacation);
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
