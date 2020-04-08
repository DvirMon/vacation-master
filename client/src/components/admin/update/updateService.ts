import { ServerServices } from "../../../services/serverService";
import { TokensServices } from "../../../services/tokensService";
import { VacationService } from "../../../services/vacationsService";
import { handleAdminUpdate } from "../../../services/socketService";
import { store } from "../../../redux/store";
import { ActionType } from "../../../redux/action-type";
import { VacationModel } from "../../../models/vacations-model";

export class UpdateService {

  static getVacation = async (vacationID : number) => {
    const url = `http://localhost:3000/api/vacations/${vacationID}`;
    const vacation = await ServerServices.getRequest(url);
    return vacation
  }

  static verifyChange = (updated : boolean) => {
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

  static handleRequest = async (vacation : VacationModel, vacationID : number) => {
    // get tokens
    const tokens = await TokensServices.handleStoreRefresh();

    // create formatDate file
    const myFormData = VacationService.setFormData(vacation);

    // send request
    const response = await VacationService.updateVacationAsync(
      `http://localhost:3000/api/vacations/${vacationID}`,
      myFormData,
      tokens.accessToken
    );

    return response;
  };

  static handleSuccess = (vacation : VacationModel, history) => {
    
    alert("Vacation has been updated successfully!");

    // update store
    store.dispatch({ type: ActionType.updatedVacation, payload: vacation });

    // update socket
    handleAdminUpdate(vacation);

    // navigate to home page
    history.push("/admin");
  };


  static handleError = (err : string) => {
    alert(err);
  };


}