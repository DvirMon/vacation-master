import { UserModel } from "../../models/user-model";
import { VacationModel } from "../../models/vacations-model";

export class UserAppState {
  public users: UserModel[] = []
}

export class FollowUpAppState {
  public followUp: VacationModel[] = []

}

export class UnFollowUpAppState {
  public unFollowUp: VacationModel[] = []
}