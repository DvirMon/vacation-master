import { ServerServices } from "../../../services/server-service";
import { FormService } from "../../../services/form-service";
import { VacationModel } from "../../../models/vacations-model";
import { ActionType } from "../../../redux/action-type";
import { store } from "../../../redux/store";
import { handleAdminUpdate } from "../../../services/socket-service";

export class UpdateForm extends FormService {

  public getVacation = async () => {
    const vacation = await ServerServices.getRequestAsync(this.url);
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

    // handle put request for vacation
    public handleIUpdateRequest = async (vacation: VacationModel) => {
      const myFormData = this.setFormData(vacation);
      const response = await ServerServices.putRequestAsync(this.url, myFormData)
      return response;
    };
    // end of function
    
    // handle success
    public handleIUpdateSuccess = (vacation: VacationModel) => {
      
      store.dispatch({ type: ActionType.updatedVacation, payload: vacation })
      handleAdminUpdate(vacation)
      this.handleSuccess(vacation)
    };
    // end of function

}