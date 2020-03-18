export class TokensModel {
 
  public constructor(
    public accessToken : string,
    public dbToken : {
      id : number,
      refreshToken : string
    }
  )
  {}

} 