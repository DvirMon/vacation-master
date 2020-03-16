import {createStore,} from "redux";  
import { UserAppState, FollowUpAppState, UnFollowUpAppState } from "../app-state/app-state";
import { userReducer, followUpReducer, unFollowUpReducer } from "../reducers/reducer";
   
export const userStore = createStore(userReducer, new UserAppState)
export const followUpStore = createStore(followUpReducer, new FollowUpAppState)
export const unFollowUpStore = createStore(unFollowUpReducer, new UnFollowUpAppState)
