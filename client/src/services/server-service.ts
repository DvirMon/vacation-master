import axios from 'axios'
import { store } from "../redux/store";
import { ActionType } from "../redux/action-type";

export class ServerServices {

  // template of get request with authorization
  static getRequestAsync = async (url: string) => {
 
    const tokens = store.getState().auth.tokens;
    const jwt = tokens ? tokens.accessToken : ""
    const options = setOptions(jwt)
  
    try {
      const response = await axios.get(url, options)
      const data = await response.data
      return data
    }
    catch (err) {
      console.log(err)
    }
  }
  // end of function
  
  // template of post request with authorization
  static postRequestAsync = async (url: string, body?: any) => {

    const tokens = store.getState().auth.tokens;
    const jwt = tokens ? tokens.accessToken : ""
    const options = setOptions(jwt)

    try {
      const response = await axios.post(url, body, options)
      const data = await response.data
      return data
    }
    catch (err) {
      console.log(err)
    }
  }
  // end of function

  // template of put request with authorization
  static putRequestAsync = async (url: string, body?: any) => {

    const tokens = store.getState().auth.tokens;
    const jwt = tokens ? tokens.accessToken : ""
    const options = setOptions(jwt)

    try {
      const response = await axios.put(url, body, options)
      const data = await response.data
      return data
    }
    catch (err) {
      console.log(err)
    }
  }
  // end of function

  // template of delete request with authorization
  static deleteRequestAsync = async (url : string) => {
    
    const tokens = store.getState().auth.tokens;
    const options = setOptions(tokens.accessToken)
    
    try {
      const response = await axios.delete(url, options)
      const data = await response.data
      return data
    }
    catch (err) {
      console.log(err)
    }
  }
  // end of function

  // handle server response
  static handleServerResponse = (response, resolve, reject?) => {
    if (response.message.trim() === "success") {
      resolve(response.body);
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

  static postRequestTokens = async (url: string) => {

    const tokens = JSON.parse(sessionStorage.getItem("jwt"))
    const options = setOptions(tokens.refreshToken)

    try {
      const response = await axios.post(url, tokens, options)
      const data = await response.data
      return data
    } catch (err) {
      return err
    }
  }

}


const setOptions = (jwt?: string) => {

  const options = {
    headers: {
      "Authorization": jwt
    }
  }
  return options
}



