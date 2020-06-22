import axios, { AxiosRequestConfig, AxiosError } from 'axios'
import { AuthServices } from './auth-service';
import { LoginServices } from './login-service';
import { environment } from "../environments/environment"
import { store } from "../redux/store";

export class InterceptorService {

  private tokenUrl: string = `${environment.server}/api/tokens`
  private authService: AuthServices = new AuthServices();
  private loginService: LoginServices = new LoginServices();

  public tokenInterceptor = (): AxiosRequestConfig | any => {
    axios.interceptors.request.use(request => {
      if (store.getState().login.isLoggedIn) {
        request.url === this.tokenUrl + "/new"
          ? request.headers.Authorization = this.setAuthHeader(false)
          : request.headers.Authorization = this.setAuthHeader(true)
      }
      console.log(request)
      return request;
    }, error => {
      return Promise.reject(error);
    });
  } 

  public errorInterceptor = () => {
    axios.interceptors.response.use((response) => {
      return response;

    }, async (error: AxiosError) => {

      if (error.response.status === 401 && store.getState().auth.isLoggedIn) {
        const request = error.config
        
        await this.authService.getAccessToken()
        return request
      }

      if (error.response.status === 403) {

      }

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