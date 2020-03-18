export class VacationErrors {
  constructor(
    public description?: string,
    public destination?: string,
    public image?: string,
    public startDate?: string,
    public endDate?: string,
    public price?: string
  ) {
  }
}

export class LoginErrors {
  public constructor(
    public userName?: string,
    public password?: string,
    public server?: string
  ) { }
}

export class RegistrationErrors extends LoginErrors {
  public constructor(
    public firstName?: string,
    public lastName?: string,
    userName?: string,
    password?: string,
    server?: string
  ) {
    super(userName, password, server)

  }

}