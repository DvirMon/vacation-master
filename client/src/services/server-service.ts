import axios from 'axios'
import { store } from "../redux/store";

export class ServerServices {

  // axios interceptor

  static handleRequestInterceptor = () => {
    axios.interceptors.request.use(config => {
      if (store.getState().login.isLoggedIn) {
        config.url === "http://localhost:3000/api/tokens/new"
        ? config.headers.Authorization = setAuthHeader(false)
        : config.headers.Authorization = setAuthHeader(true)
      }
      return config;
    }, error => {
      return Promise.reject(error);
    });
  }

  // template of get request with authorization
  static getRequestAsync = async (url: string) => {
    const response = await axios.get(url)
    const data = await response.data
    return data
  }
  // end of function

  // template of post request with authorization
  static postRequestAsync = async (url: string, body: any) => {
    // const options = setAuthHeader(jwt)
    const response = await axios.post(url, body)
    const data = await response.data
    return data
  }
  // end of function

  // template of put request with authorization
  static putRequestAsync = async (url: string, body?: any) => {
    const response = await axios.put(url, body)
    const data = await response.data
    return data
  }
  // end of function

  // template of delete request with authorization
  static deleteRequestAsync = async (url: string) => {
    const response = await axios.delete(url)
    const data = await response.data
    return data
  }
  // end of function
}

const setAuthHeader = (bool: boolean) => {
  const tokens = store.getState().auth.tokens
  if (tokens) {
    return bool ? tokens.accessToken : tokens.dbToken?.refreshToken
  }
}



