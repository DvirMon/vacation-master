import { ChartModel } from "../../models/charts-model"
import { UserVacationModel } from "../../models/vacations-model"
import { NotificationModel } from "../../models/notification-model"

export class VacationAppState {
  public followUp: UserVacationModel[] = []
  public unFollowUp: UserVacationModel[] = []
  public dataPoints: ChartModel[] = []
  public notification : NotificationModel[] = []

}
