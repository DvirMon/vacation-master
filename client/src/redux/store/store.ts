import {createStore,} from "redux";  
import { AppState } from "../app-state/app-state";
import { rootReducer,  } from "../reducers/reducer";
   
export const store = createStore(rootReducer, new AppState) 
