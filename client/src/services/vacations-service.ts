import { VacationModel } from "../models/vacations-model";

import { HttpService } from "./http-service";
import { ValidationService } from "./validation-service";

import { store } from "../redux/store";
import { ActionType } from "../redux/action-type";

import { environment } from "../environments/environment"

// class to handle all vacation logic
export class VacationService {

  private vacationUrl: string = `${environment.server}/api/vacations`
  private followUpUrl: string = `${environment.server}/api/followup`

  private http: HttpService = new HttpService()
  private validationService: ValidationService = new ValidationService()

  // request section

  // GET user vacation : http://localhost:3000/api/vacations/user
  public getUserVacationAsync = async () => {
    const response = await this.http.getRequestAsync(this.vacationUrl + "/user")
    store.dispatch({ type: ActionType.getAllVacation, payload: response });

    // return response
  }

  // GET all the users following a vacation : http://localhost:3000/api/followup/:vacationID;
  public getFollowersByVacationAsync = async (vacationID) => {
    const response = await this.http.getRequestAsync(this.followUpUrl + `/${vacationID}`)
    return response
  }

  // POST new followup vacation : http://localhost:3000/api/followup`
  public addFollowUpAsync = async (vacationID) => {
    try {
      const response = await this.http.postRequestAsync(this.followUpUrl, { vacationID });
      return response
    } catch (err) {
      console.log(err);
    }
  };

  // DELETE followup vacation : http://localhost:3000/api/followup/:id
  public deleteFollowUpAsync = async (id) => {
    try {
      await this.http.deleteRequestAsync(this.followUpUrl + `/${id}`);
    } catch (err) {
      console.log(err);
    }
  };

  // DELETE vacation (admin) : http://localhost:3000/api/vacations/${vacationID}/${fileName}

  public deleteVacationAsync = async (vacationID : string, fileName : string | File) => {
    await this.http.deleteRequestAsync(this.vacationUrl + `/${vacationID}/${fileName}`);
    store.dispatch({ type: ActionType.deleteVacation, payload: vacationID });

  };





  // function to handle add followup 
  public handleAddFollowUp = async (vacation) => {
    try {

      // add to database
      const addedFollowup = await this.addFollowUpAsync(vacation.vacationID);

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
  public handleDeleteFollowUp = async (vacation) => {
    try {

      // delete in database
      await this.deleteFollowUpAsync(vacation.followUpID);

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
  public handleIconClick = async (vacation) => {
    if (vacation.followUpID) {
      await this.handleDeleteFollowUp(vacation)
    } else {
      await this.handleAddFollowUp(vacation);
    }
  };
  // end of function


  public validVacationForm = (vacation) => {
    const valid = this.validationService.formLegal(
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
