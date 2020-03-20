import React, { Component } from "react";
import "./layout.scss";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Login from "../login/login";
import Vacations from "../vacations/vacations";
import Register from "../register/register";
import Admin from "../admin/admin/admin";
import Input from "../input/input";

export class Layout extends Component {
  render() {
    return (
      <React.Fragment>
        <BrowserRouter>  
          <Switch> 
            <Route path="/login" component={Login} exact></Route>
            <Route path="/register" component={Register} exact></Route>
            <Route path="/admin" component={Admin} exact></Route>
            <Route path="/user/:id" component={Vacations} exact></Route>
            <Redirect from="/" to="/login"></Redirect>
          </Switch>
        </BrowserRouter>
      </React.Fragment>
    ); 
  }
}

export default Layout;
