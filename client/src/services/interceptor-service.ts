import axios from 'axios'
import { store } from "../redux/store";
import { environment } from "../environments/environment"

export class InterceptorService {
  
  private server: string = `${environment.server}/api/tokens`

  public handleRequestInterceptor = () => {
    axios.interceptors.request.use(request => {
      if (store.getState().login.isLoggedIn) {
        request.url === this.server + "/new"
          ? request.headers.Authorization = this.setAuthHeader(false)
          : request.headers.Authorization = this.setAuthHeader(true)
      }
      return request;
    }, error => { 
      return Promise.reject(error);
    });
  }

  private setAuthHeader = (bool: boolean) => {
    const tokens = store.getState().auth.tokens
    if (tokens) {
      return bool ? tokens.accessToken : tokens.dbToken?.refreshToken
    }
  }
}