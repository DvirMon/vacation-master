import React from 'react';
import { GoogleLogin } from 'react-google-login';
import { environment } from '../../../environment';
import { LoginServices } from '../../../services/login-service';

import "./google.scss";

const clientId = environment.CLIENT_ID

const loginService = new LoginServices();

const LoginGoogle = () => {

  const onSuccess = async (res) => {
    await loginService.loginGoogle(res)
  }

  const onFailure = (res) => {
    console.log(res)
  }

  return (
    <div>
      <GoogleLogin
        className="google-login"
        clientId={clientId}
        buttonText="Sign-In with Google"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        isSignedIn={true}
      >
      </GoogleLogin>
    </div>
  )
}

export default LoginGoogle



