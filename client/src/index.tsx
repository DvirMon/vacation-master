import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Layout from './components/layout/layout';
import { InterceptorService } from './services/interceptor-service';

const interceptorService : InterceptorService = new InterceptorService()
interceptorService.handleRequestInterceptor()

ReactDOM.render(<Layout />, document.getElementById('root'));
serviceWorker.unregister();
