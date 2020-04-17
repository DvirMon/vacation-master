import { ServerServices } from "../../../services/server-service";
import { FormService } from "../../../services/form-service";

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

}