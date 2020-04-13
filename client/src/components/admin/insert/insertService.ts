import { VacationModel } from "../../../models/vacations-model";

import { AuthServices } from "../../../services/auth-service";
import { handleAdminInsert } from "../../../services/socket-service";
import { VacationService } from "../../../services/vacations-service";
import { ServerServices } from "../../../services/server-service";


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
    const tokens = await AuthServices.handleStoreRefresh();
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