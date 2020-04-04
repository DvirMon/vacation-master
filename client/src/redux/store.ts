
import { createStore } from 'redux'; 
import { reducers } from './reducers/reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
 
// export const store = createStore(reducer, new AppState)  
export const store = createStore(reducers, composeWithDevTools())

 