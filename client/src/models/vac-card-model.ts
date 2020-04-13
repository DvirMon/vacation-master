
export class VacationCardSetting {

  public constructor (
    public admin?: boolean,
    public follow?: boolean,
    public adminIcons? : boolean,
    public followIcon?: boolean,
    public hover?: boolean, 
    public img?: string
  )
  {

  this.img = ""
  }
  
}

export const followSetting = new VacationCardSetting(false, true, false, true, true)
export const unFollowUserSetting = new VacationCardSetting(false, false, false, true, true)
export const unFollowAdminSetting = new VacationCardSetting(true, false, true, false,  true)
export const formAdminSetting = new VacationCardSetting(true, false, false ,false, false)