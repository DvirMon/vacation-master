import React, { Component } from 'react'
import { store } from '../../redux/store/store';
import { ActionType } from '../../redux/action-type/action-type';
import { deleteRequest } from '../../services/serverService';

export class Logout extends Component <any, any> {


  public componentDidMount = async () => {

      try {
    
        const tokens = store.getState().tokens
     
        // clear refreshToken from db
        const url = `http://localhost:3000/api/tokens/${tokens.dbToken.id}`;
        await deleteRequest(url);
    
        // handle logic in store
        store.dispatch({ type: ActionType.Logout })
    
        // redirect to login page
        this.props.history.push("/login");
      }
      catch (err) {
        console.log(err)
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
