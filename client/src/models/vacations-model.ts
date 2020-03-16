export class VacationModel {

  constructor(
    public followUpID?: number,
    public vacationID?: number,
    public description?: string,
    public destination?: string,
    public continentID?: number,
    public image?: string,
    public startDate?: string,
    public endDate?: string,
    public price?: number
  ) {

  }


}

export class UserVacationsModel {
  
  constructor(
    public unFollowed?: VacationModel[],
    public followUp?: VacationModel[],
  ) { }

}

export class FollowUpModel {
  
  constructor(
    public vacationID?: number,
    public userID?: string,
  ) { }

}