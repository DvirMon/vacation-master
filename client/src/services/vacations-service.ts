import { VacationModel } from "../models/vacations-model";

import { HttpService } from "./http-service";
import { FormService } from "./form-service";
import { SocketService } from "./socket-service";
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
  private formService: FormService = new FormService()
  private socketService: SocketService = new SocketService()

  // request section

  // GET vacation : http://localhost:3000/api/vacations/:id
  public getVacation = async (vacationId: string): Promise<VacationModel> => {
    const vacation = await this.http.getRequestAsync(this.vacationUrl + `/${vacationId}`);
    return vacation
  }

  // GET user vacation : http://localhost:3000/api/vacations/user
  public getUserVacationAsync = async (): Promise<void> => {
    const response = await this.http.getRequestAsync(this.vacationUrl + "/user")
    store.dispatch({ type: ActionType.GetAllVacation, payload: response });

    // return response
  }

  //POST - new vacation : http://localhost:3000/api/vacations
  public addNewVacation = async (vacation: VacationModel) => {

    // handle request
    const formData = this.formService.setFormData(vacation);
    const response = await this.http.postRequestAsync(this.vacationUrl, formData)

    // handle response
    store.dispatch({ type: ActionType.AddVacation, payload: response })
    this.socketService.handleAdminInsert(vacation)
    this.formService.handleSuccess("add new vacation!")
  }

  //PUT - update vacation : http://localhost:3000/api/vacations/:id
  public updateVacation = async (vacation: VacationModel, vacationId: string) => {

    // handle request
    const formData = this.formService.setFormData(vacation);
    const response = await this.http.putRequestAsync(this.vacationUrl + `/${vacationId}`, formData)

    // handle response
    store.dispatch({ type: ActionType.UpdatedVacation, payload: response })
    this.socketService.handleAdminUpdate(vacation)
    this.formService.handleSuccess("updated vacation!")
  }

  // DELETE vacation (admin) : http://localhost:3000/api/vacations/:vacationID/:fileName

  public deleteVacationAsync = async (vacationID: string, fileName: string | File): Promise<void> => {
    await this.http.deleteRequestAsync(this.vacationUrl + `/${vacationID}/${fileName}`);
    store.dispatch({ type: ActionType.DeleteVacation, payload: vacationID });

  };

  //GET all vacation anf followers-  http://localhost:3000/api/followup

  public getChartInfo = async () => {
    const response = await this.http.getRequestAsync(this.followUpUrl);
    store.dispatch({ type: ActionType.UpdateChartPoints, payload: response });
  }

  // GET all the users following a vacation : http://localhost:3000/api/followup/:vacationID;
  public getFollowersByVacationAsync = async (vacationID): Promise<any> => {
    const response = await this.http.getRequestAsync(this.followUpUrl + `/${vacationID}`)
    return response
  }

  // POST new followup vacation : http://localhost:3000/api/followup`
  public addFollowUpAsync = async (vacationID): Promise<any> => {
    const response = await this.http.postRequestAsync(this.followUpUrl, { vacationID });
    return response
  };

  // DELETE followup vacation : http://localhost:3000/api/followup/:id
  public deleteFollowUpAsync = async (id): Promise<void> => {
    await this.http.deleteRequestAsync(this.followUpUrl + `/${id}`);
  };



  // function to handle add followup 
  public handleAddFollowUp = async (vacation): Promise<void> => {
    try {

      // add to database
      const addedFollowup = await this.addFollowUpAsync(vacation.vacationID);

      // add follow up ID to new followed vacation
      vacation.followUpID = addedFollowup.id;

      // add to store
      store.dispatch({ type: ActionType.AddFollowUp, payload: vacation });

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
        type: ActionType.DeleteFollowUp, payload: vacation
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
