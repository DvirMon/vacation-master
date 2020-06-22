import { VacationModel } from "../../../models/vacations-model";
import { FormService } from "../../../services/form-service";

import { store } from "../../../redux/store";
import { ActionType } from "../../../redux/action-type";

export class UpdateForm extends FormService {


  // handle put request for vacation
  public handleIUpdateRequest = async (vacation: VacationModel): Promise<VacationModel> => {
    const formData = this.setFormData(vacation);
    const response = await this.http.putRequestAsync(this.url, formData)
    return response;
  }
  // end of function


  // handle success
  public handleIUpdateSuccess = (vacation: VacationModel) => {
    store.dispatch({ type: ActionType.updatedVacation, payload: vacation })
    this.socketService.handleAdminUpdate(vacation)
    this.handleSuccess()
  };
  // end of function

}