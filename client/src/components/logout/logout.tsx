import React, { Component } from 'react'

import { ServerServices } from '../../services/serverService';
 
// import redux
import { store } from '../../redux/store';
import { ActionType } from '../../redux/action-type';

export class Logout extends Component <any, any> {


  public componentDidMount = async () => {
      try {
    
        const tokens = store.getState().auth.tokens

        // clear refreshToken from db
        const url = `http://localhost:3000/api/tokens/${tokens.dbToken.id}`;
        await ServerServices.deleteRequest(url);
        
        // handle logic in store
        store.dispatch({ type: ActionType.Logout })
    
        // redirect to login page
        this.props.history.push("/login");
      }
      catch (err) {
        console.log(err)
        this.props.history.push("/login");
      }
  }
 
  render() {
    return (
      <div>
        
      </div>
    )
  }
}

export default Logout
