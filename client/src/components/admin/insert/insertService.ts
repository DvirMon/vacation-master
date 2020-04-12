import { VacationModel } from "../../../models/vacations-model";

import { TokensServices } from "../../../services/tokensService";
import { handleAdminInsert } from "../../../services/socketService";
import { VacationService } from "../../../services/vacationsService";
import { ServerServices } from "../../../services/serverService";


export class InsertService {

    // function for add new vacation
    public addVacationAsync = async (url: string, vacation?: FormData, accessToken?: string) => {
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

  public handleRequest = async (vacation: VacationModel) => {

    // get tokens
    const tokens = await TokensServices.handleStoreRefresh();
    // create formatDate file
    const myFormData = VacationService.setFormData(vacation);

    // send a request
    const response = await this.addVacationAsync(
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