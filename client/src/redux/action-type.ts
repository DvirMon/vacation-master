export enum ActionType {

  // auth ActionType
  Login,
  Logout,
  IsAdmin,
  AddAccessToken,
  AddRefreshToken,
  UpdateSocket,

  // vacations ActionType
  GetAllVacation,
  AddVacation,
  AddFollowUp,
  UpdatedVacation,
  UpdateChartPoints,
  DeleteVacation,
  DeleteFollowUp,
  DeleteAllNotification,

  // style ActionType
  UpdateMenu,
  UpdateBackground,
  UpdateSliderSetting,
  UpdateNotification,

} 