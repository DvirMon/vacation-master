import { VacationModel } from "../models/vacations-model";

import { ServerServices } from "../services/server-service";
import { VacationService } from "../services/vacations-service";
import { handleAdminInsert } from "../services/socket-service";
import { store } from "../redux/store";
import { ActionType } from "../redux/action-type";

export class FormService {

  constructor(
    public url: string, 
    public successMsg: string, 
    public actionType: ActionType, 
    public serviceMethod : string,
    public history : any
    ) { }

  // handle post request for vacation
  public handleRequest = async (vacation: VacationModel) => {

    // create formatDate file
    const myFormData = VacationService.setFormData(vacation);
    const response = await ServerServices[this.serviceMethod](this.url, myFormData)
    return response;
  };
  // end of function


  // handle success
  public handleSuccess = (vacation: VacationModel) => {

    alert(this.successMsg);

    store.dispatch({ type: this.actionType, payload: vacation })

    handleAdminInsert(vacation);

    this.history.push("/admin");
  };
  // end of function

  public handleError = (err: string) => {
    alert(err);
  };
}