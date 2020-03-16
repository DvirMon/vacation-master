import { UserActionType, VacationActionType } from "../action-type/action-type";

export interface UserAction {

  type: UserActionType  
  payloud?: any 

}

export interface VacationAction {

  type: VacationActionType  
  payloud?: any 

}