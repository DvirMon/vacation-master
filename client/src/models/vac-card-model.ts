import { UserVacationModel } from "./vacations-model";

export class VacationCardModel {

  public constructor (
    public vacation?: UserVacationModel,
    public followIcon?: boolean,
    public admin?: boolean,
    public adminIcons? : boolean,
    public margin?: boolean,
    public hover?: boolean,
    public follow?: boolean,
    public preview?: string
  )
  {}

}