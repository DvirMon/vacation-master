import { combineReducers } from "redux";
import { vacationReducer } from "./vacation-reducer";
import { styleReducer } from "./style-reducer";
import { loginReducer } from "./login-reducer";
import { authReducer } from './auth-reducer'
    
export const reducers = combineReducers({
  login : loginReducer,
  auth : authReducer,
  style : styleReducer,
  vacation : vacationReducer
})  