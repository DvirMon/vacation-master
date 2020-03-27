import { ActionType  } from "../action-type/action-type";

export interface Action {

  type: ActionType  
  payload?: any 

}