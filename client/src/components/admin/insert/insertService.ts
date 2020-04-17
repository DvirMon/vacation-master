import { VacationModel } from "../../../models/vacations-model";

import { ServerServices } from "../../../services/server-service";
import { VacationService } from "../../../services/vacations-service";
import { handleAdminInsert } from "../../../services/socket-service";

// import redux
import { store } from "../../../redux/store";
import { ActionType } from "../../../redux/action-type";


export class InsertService {

  // handle post request for vacation
  public handleRequest = async (vacation: VacationModel) => {
    
    // create formatDate file
    const myFormData = VacationService.setFormData(vacation);
    const url = `http://localhost:3000/api/vacations`
    const response = await ServerServices.postRequestAsync(url, myFormData)
    return response;
  };
  // end of function
  
  // handle success
  public handleSuccess = (vacation: VacationModel, history) => {
    
    alert("New Vacation has been added!");

    store.dispatch({ type: ActionType.addVacation, payload: vacation })
    
    handleAdminInsert(vacation);
    
    history.push("/admin");
  };
  // end of function
  
  public handleError = (err: string) => {
    alert(err);
  };
}