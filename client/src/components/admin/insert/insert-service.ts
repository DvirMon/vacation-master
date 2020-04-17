import { VacationModel } from "../../../models/vacations-model";

import { FormService } from "../../../services/form-service";
import { ServerServices } from "../../../services/server-service";
import { handleAdminInsert } from "../../../services/socket-service";

// import redux
import { store } from "../../../redux/store";
import { ActionType } from "../../../redux/action-type";


export class InsertForm extends FormService{

  // handle post request for vacation
  public handleInsertRequest = async (vacation: VacationModel) => {
    
    const myFormData = this.setFormData(vacation);
    const response = await ServerServices.postRequestAsync(this.url, myFormData, true)
    return response;
  };
  // end of function
  
  // handle success
  public handleInsertSuccess = (vacation: VacationModel) => {
    
    store.dispatch({ type: ActionType.addVacation, payload: vacation })
    handleAdminInsert(vacation)
    this.handleSuccess()
  };
  // end of function
}