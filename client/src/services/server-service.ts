import axios from 'axios'
import { store } from "../redux/store";
import { ActionType } from "../redux/action-type";

export class ServerServices {

  // template of get request with authorization
  static getRequestAsync = async (url: string) => {

    try {
      const options = setOptions(true)
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

    try {
      const options = setOptions(true)
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

    try {
      const options = setOptions(true)
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
  static deleteRequestAsync = async (url: string) => {
    try {
      const options = setOptions(true)
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

  // post request for new access token
  static postRequestTokens = async (url: string) => {
    try {
      const tokens = JSON.parse(sessionStorage.getItem("jwt"))
      const options = setOptions(false)
      const response = await axios.post(url, tokens, options)
      const data = await response.data
      return data
    } catch (err) {
      return err
    }
  }
  // end of function

  // handle server response
  static handleTokenResponse = (response) => {
    if (response.message === "success") {
      store.dispatch({ type: ActionType.addToken, payload: response.body });
    } else {
      alert(response)
    }
  }
  // end of function

}


const setOptions = (bool: boolean) => {

  let tokens;
  let jwt;

  if (bool) {
    tokens = store.getState().auth.tokens;
    jwt = tokens ? tokens.accessToken : ""
  } else {
    tokens = JSON.parse(sessionStorage.getItem("jwt"))
    jwt = tokens.refreshToken
  }

  const options = {
    headers: {
      "Authorization": jwt
    }
  }
  return options
}



