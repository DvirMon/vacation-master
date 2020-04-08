import { ServerServices } from "./serverService";
import { store } from "../redux/store";
import { ActionType } from "../redux/action-type";
import { updateChart } from "./socketService";

// class to handle all vacation logic
export class VacationService {

  // function tp get user followed and un-followed vacations
  static getVacationsAsync = async (accessToken) => {
    const url = `http://localhost:3000/api/vacations/user`;
    try {
      const response = await ServerServices.getRequest(url, accessToken);
      return response
    } catch (err) {
      return err
    }
  }
  //end of functions

  // get all the users following a vacation
  static getFollowersByVacationAsync = async (vacationID) => {
    const url = `http://localhost:3000/api/followup/${vacationID}`;
    try {
      const response = await ServerServices.getRequest(url)
      return response
    }
    catch (err) {
      console.log(err)
    }
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

  // function to update vacation
  static updateVacationAsync = async (url: string, vacation?: FormData, accessToken?: string) => {
    const options = {
      method: "PUT",
      headers: {
        "Authorization": accessToken
      },
      body: vacation
    };

    try {
      const response = await ServerServices.getData(url, options);
      return response
    } catch (err) {
      return err
    }
  }
  // end of function

  // function for add new vacation
  static addVacationAsync = async (url: string, vacation?: FormData, accessToken?: string) => {
    const options = {
      method: "POST",
      headers: {
        "Authorization": accessToken
      },
      body: vacation
    };

    try {
      const response = await ServerServices.getData(url, options);
      return response
    } catch (err) {
      return err
    }
  }
  // end of function

  // function to handle add followup logic
  static handleAddFollowUp = async (vacation, accessToken) => {
    try {
      const addedVacation = await VacationService.addFollowUpAsync(
        vacation.vacationID,
        accessToken
      );
      vacation.followUpID = addedVacation.id;
      const action = {
        type: ActionType.addFollowUp,
        payload: vacation,
      };
      store.dispatch(action);
    } catch (err) {
      console.log(err)
    }
  }
  // end of function

  // function to handle delete followup logic
  static handleDeleteFollowUp = async (vacation, accessToken) => {
    try { 
      await VacationService.deleteFollowUpAsync(
        vacation.followUpID,
        accessToken
      );
      const action = {
        type: ActionType.deleteFollowUp,
        payload: vacation,
      };
      store.dispatch(action);

    } catch (err) {
      console.log(err)
    }
  }
  // end of function

  // function to handle icon followup click
  static handleIconClick = async (vacation) => {
    const accessToken = store.getState().auth.tokens.accessToken;
    if (vacation.followUpID) {
      await VacationService.handleDeleteFollowUp(vacation, accessToken);
    } else {
      await VacationService.handleAddFollowUp(vacation, accessToken);
    }
  };
  // end of function


}
// end of vacation service
