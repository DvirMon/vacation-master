import { VacationModel } from "../../../models/vacations-model";

import { TokensServices } from "../../../services/tokensService";
import { handleAdminInsert } from "../../../services/socketService";
import { VacationService } from "../../../services/vacationsService";


export class InsertService {

  public handleRequest = async (vacation: VacationModel) => {

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
  
  
  public handleSuccess = (vacation: VacationModel, history) => {
    
    alert("New Vacation has been added!");
 
    handleAdminInsert(vacation);

    history.push("/admin");
  };

  public handleError = (err: string) => {
    alert(err);
  };
}