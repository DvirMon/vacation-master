import { VacationModel } from "../../../models/vacations-model";

import { ServerServices } from "../../../services/serverService";
import { TokensServices } from "../../../services/tokensService";
import { VacationService } from "../../../services/vacationsService";
import { handleAdminUpdate } from "../../../services/socketService";

import { store } from "../../../redux/store";
import { ActionType } from "../../../redux/action-type";

export class UpdateService {

  constructor(public vacationID : number){}

  public getVacation = async () => { 

    const url = `http://localhost:3000/api/vacations/${this.vacationID}`;
    const vacation = await ServerServices.getRequest(url);
    return vacation
  }

  public verifyChange = (updated : boolean) => {
    
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

  public handleRequest = async (vacation : VacationModel) => {
  
    // get tokens
    const tokens = await TokensServices.handleStoreRefresh();

    // create formatDate file
    const myFormData = VacationService.setFormData(vacation);
 
    // send request
    const response = await VacationService.updateVacationAsync(
      `http://localhost:3000/api/vacations/${this.vacationID}`,
      myFormData,
      tokens.accessToken
    );

    return response;
  };

  public handleSuccess = (vacation : VacationModel, history) => {
    
    alert("Vacation has been updated successfully!");

    // update socket
    handleAdminUpdate(vacation);

    // navigate to home page
    history.push("/admin");
  };


  public handleError = (err : string) => {
    alert(err);
  };


}