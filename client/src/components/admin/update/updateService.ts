import { VacationModel } from "../../../models/vacations-model";

import { ServerServices } from "../../../services/server-service";
import { AuthServices } from "../../../services/auth-service";
import { VacationService } from "../../../services/vacations-service";
import { handleAdminUpdate } from "../../../services/socket-service";


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
  public updateVacationAsync = async (url: string, vacation?: FormData) => {
    const tokens = await AuthServices.handleStoreRefresh();

    const options = {
      method: "PUT",
      headers: {
        "Authorization": tokens.accessToken
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

    // create formatDate file
    const myFormData = VacationService.setFormData(vacation);

    // send request
    const response = await this.updateVacationAsync(
      `http://localhost:3000/api/vacations/${this.vacationID}`,
      myFormData,
    );

    return response;
  };

  public handleSuccess = (vacation: VacationModel, history) => {

    alert("Vacation has been updated successfully!");

    // update socket
    handleAdminUpdate(vacation);

    // navigate to home page
    history.push("/admin");
  };


  public handleError = (err: string) => {
    alert(err);
  };


}