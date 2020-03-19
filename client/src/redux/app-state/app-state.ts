import { VacationModel, UserVacationModel } from "../../models/vacations-model";
import { UserModel } from "../../models/user-model";
import { TokensModel } from "../../models/tokens.model";

export class AppState {
 
  public user  : UserModel = new UserModel() ;
  public tokens: TokensModel = new TokensModel();
  public followUp: UserVacationModel[] = [];
  public unFollowUp: UserVacationModel[] = [];
} 