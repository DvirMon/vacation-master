import axios, { AxiosRequestConfig } from 'axios'
import { store } from "../redux/store";
import { environment } from "../environments/environment"

export class InterceptorService {

  private tokenUrl: string = `${environment.server}/api/tokens`

  public handleRequestInterceptor = (): AxiosRequestConfig | any => {
    axios.interceptors.request.use(request => {
      if (store.getState().login.isLoggedIn) {
        request.url === this.tokenUrl + "/new"
          ? request.headers.Authorization = this.setAuthHeader(false)
          : request.headers.Authorization = this.setAuthHeader(true)
      }
      return request;
    }, error => {
      return Promise.reject(error);
    });
  }

  private setAuthHeader = (bool: boolean): string => {
    const tokens = store.getState().auth.tokens
    if (tokens) {
      return bool ? tokens.accessToken : tokens.dbToken?.refreshToken
    }
  }
}