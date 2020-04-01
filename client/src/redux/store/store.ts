import {createStore,} from "redux";  
import { AppState } from "../app-state/app-state";
import { reducer } from "../reducers/reducer";
   
export const store = createStore(reducer, new AppState) 