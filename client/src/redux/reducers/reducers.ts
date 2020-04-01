import { combineReducers } from "redux";
import { vacationReducer } from "./vacation-reducer";
import { authReducer } from "./auth-reducer";
import { styleReducer } from "./style-reducer";
 
export const reducers = combineReducers({
  vacation : vacationReducer,
  auth : authReducer,
  style : styleReducer
})