import { VacationModel } from "../../../models/vacations-model";
import { FormService } from "../../../services/form-service";
import { handleAdminUpdate } from "../../../services/socket-service";

import { store } from "../../../redux/store";
import { ActionType } from "../../../redux/action-type";

export class UpdateForm extends FormService {


  public getVacation = async () => {
    const vacation = await this.http.getRequestAsync(this.url);
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
    const response = await this.http.putRequestAsync(this.url, myFormData)
    return response;
  }
  // end of function


  // handle success
  public handleIUpdateSuccess = (vacation: VacationModel) => {
    store.dispatch({ type: ActionType.updatedVacation, payload: vacation })
    handleAdminUpdate(vacation)
    this.handleSuccess()
  };
  // end of function

}