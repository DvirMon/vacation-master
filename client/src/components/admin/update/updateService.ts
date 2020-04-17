import { VacationModel } from "../../../models/vacations-model";

import { ServerServices } from "../../../services/server-service";
import { VacationService } from "../../../services/vacations-service";
import { handleAdminUpdate } from "../../../services/socket-service";

// import redux
import { store } from "../../../redux/store";
import { ActionType } from "../../../redux/action-type";

export class UpdateService {

  constructor(public vacationID: number) { }

  public getVacation = async () => {

    const url = `http://localhost:3000/api/vacations/${this.vacationID}`;
    const vacation = await ServerServices.getRequestAsync(url);
    return vacation
  }

  public verifyChange = (updated: boolean) => {

    if (updated) {
      const answer = window.confirm(
        "No change has been notice, do you wish to continue?"
      );
      if (!answer) {
        return true;
      }
      return false
    }
  }

  // function to update vacation
  public handleRequest = async (vacation: VacationModel) => {

    // create formatDate file
    const myFormData = VacationService.setFormData(vacation);
    const url = `http://localhost:3000/api/vacations/${this.vacationID}`
    const response = await ServerServices.putRequestAsync(url, myFormData)
    return response;
  };


  public handleSuccess = (vacation: VacationModel, history) => {

    alert("Vacation has been updated successfully!");

    store.dispatch({ type: ActionType.updatedVacation, payload: vacation })

    handleAdminUpdate(vacation);

    history.push("/admin");
  };


  public handleError = (err: string) => {
    alert(err);
  };


}