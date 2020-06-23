import { combineReducers } from "redux";
import { vacationReducer } from "./vacation-reducer";
import { styleReducer } from "./style-reducer";
import { authReducer } from './auth-reducer'
    
export const reducers = combineReducers({
  auth : authReducer,
  style : styleReducer,
  vacation : vacationReducer
})  