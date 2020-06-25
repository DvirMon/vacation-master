
export class VacationCardModel {

  public constructor( 
    public admin?: boolean,
    public follow?: boolean,
    public adminIcons?: boolean,
    public followIcon?: boolean,
    public hover?: boolean,
    public img?: string
  ) {

  }

}

export const followSetting = new VacationCardModel(false, true, false, true, true)
export const unFollowUserSetting = new VacationCardModel(false, false, false, true, true)
export const unFollowAdminSetting = new VacationCardModel(true, false, true, false, true)
export const formAdminSetting = new VacationCardModel(true, false, false, false, false)