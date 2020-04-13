import axios from 'axios'
import { store } from "../redux/store";
import { ActionType } from "../redux/action-type";



export class ServerServices {

  static getDateAsync = async (url) => {

    const tokens = store.getState().auth.tokens

    const options = {
      headers: {
        "Authorization": tokens.accessToken
      }
    }
    try {
      const response = await axios.get(url, options)
      const data = await response.data
      return data
    }
    catch (err) {
      console.log(err)
    }
    
  }
  
  // template of fetch get request
  static getData = async (url: string, options?: {}) => {
    
    try {
      const response = await fetch(url, options)
      const data = await response.json()
      return data
    }
    catch (err) {
      if (err.name === 'AbortError') {
        console.log('Fetch aborted');
        return
      }
      return err
    }
  }
  // end of function

  // template of get request with authorization
  // static getRequest = async (url: string, accessToken?: string) => {

  //   const options = {
  //     headers: {
  //       "Authorization": accessToken,
  //     }
  //   };

  //   try {
  //     const response = await ServerServices.getData(url, options);
  //     return response
  //   } catch (err) {
  //     return err
  //   }

  // }
  // end of function

  // template of post request with authorization
  static postRequest = async (url: string, body?: any, accessToken?: string) => {

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": accessToken
      },
      body: JSON.stringify(body)
    };

    try {
      const response = await ServerServices.getData(url, options);
      return response
    } catch (err) {
      return err
    }
  }
  // end of function


  // template for delete request
  static deleteRequest = async (url: string, accessToken?: string) => {
    const options = {
      method: "DELETE",
      headers: {
        "Authorization": accessToken
      }
    };
    try {
      await fetch(url, options);
    } catch (err) {
      return err
    }
  }
  // end of function

  // handle server response
  static handleServerResponse = (response, resolve, reject, history?) => {
    if (response.message.trim() === "success") {
      resolve(response.body, history);
      return
    } else {
      reject(response.body ? response.body : "Pay attention! you cant use apostrophe mark")
    }
  };
  // end of function

  static handleTokenResponse = (response) => {
    if (response.message === "success") {
      store.dispatch({ type: ActionType.addToken, payload: response.body });
    } else {
      alert(response)
    }
  }
}


