import { VacationModel } from "../../../models/vacations-model";

import { TokensServices } from "../../../services/tokensService";
import { handleAdminInsert } from "../../../services/socketService";
import { VacationService } from "../../../services/vacationsService";

import { store } from "../../../redux/store";
import { ActionType } from "../../../redux/action-type";

export class InsertService {
  
  static handleRequest = async (vacation : VacationModel) => {
    
    // get tokens
    const tokens = await TokensServices.handleStoreRefresh();
    // create formatDate file
    const myFormData = VacationService.setFormData(vacation);

    // send a request
    const response = await VacationService.addVacationAsync(
      `http://localhost:3000/api/vacations`,
      myFormData,
      tokens.accessToken
    );
    return response;
  };
 
  
  static handleSuccess = (vacation : VacationModel, history) => {

    const action = { type: ActionType.addVacation, payload: vacation };
    
    store.dispatch(action);

    handleAdminInsert(vacation);

    alert("New Vacation has been added!");

    history.push("/admin");
  };
  
  static handleError = (err) => {
    alert(err);
  };
}