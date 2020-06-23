import axios, { AxiosRequestConfig, AxiosError } from 'axios'
import { AuthServices } from './auth-service';

import { environment } from "../environments/environment"
import history from '../history';
import { store } from "../redux/store";

export class InterceptorService {

  private tokenUrl: string = `${environment.server}/api/tokens`
  private authService: AuthServices = new AuthServices();

  public tokenInterceptor = (): AxiosRequestConfig | any => {
    axios.interceptors.request.use(request => {
      if (store.getState().auth.isLoggedIn) {
        request.url === this.tokenUrl + "/new"
          ? request.headers.Authorization = this.setAuthHeader(false)
          : request.headers.Authorization = this.setAuthHeader(true)
      }
      return request;
    }, error => {
      return Promise.reject(error);
    });
  } 

  public errorInterceptor = () => {
    axios.interceptors.response.use((response) => {
      return response;

    }, async (error: AxiosError) => {
      console.log(error)

      if (error.response?.status === 401 && store.getState().auth.isLoggedIn) {
        const request = error.config

        console.log(request.url)
        if(request.url === this.tokenUrl + "/new") {
          console.log("please login")
          history.push("/logout")
          return
        }

        await this.authService.getAccessToken()
        return request
      }

      if (error.response?.status === 403) {

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