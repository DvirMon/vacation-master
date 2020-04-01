import { combineReducers } from "redux";
import { adminReducer } from "./admin-reducer";
import { authReducer } from "./auth-reducer";
import { styleReducer } from "./style-reducer";

export const rootReducer = combineReducers({
  admin : adminReducer,
  auth : authReducer,
  style : styleReducer
})