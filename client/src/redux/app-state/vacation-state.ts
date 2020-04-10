import { UserVacationModel, Notification } from "../../models/vacations-model"
import { ChartModel } from "../../models/charts-model"

export class VacationAppState {
  public followUp: UserVacationModel[] = []
  public unFollowUp: UserVacationModel[] = []
  public dataPoints: ChartModel[] = []
  public notification : Notification[] = []

}
