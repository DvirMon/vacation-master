import React, { Component } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Login from "../login/login";
import Register from "../register/register";
import Admin from "../admin/admin/admin";
import User from "../user/user";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./layout.scss";

export class Layout extends Component {
  render() {
    return (
      <BrowserRouter>
          <Route render={({ location }) => (
                <TransitionGroup
                className="app"
                >
                  <CSSTransition 
                  key={location.key} 
                  timeout={600}
                  classNames="slide"
                  >
                  <Switch location={location}>
                    <Route path="/login" component={Login} exact></Route>
                    <Route path="/register" component={Register} exact></Route>
                    <Route path="/admin" component={Admin} exact></Route>
                    <Route path="/user/:id" component={User} exact></Route>
                    <Redirect from="/" to="/login"></Redirect>
                  </Switch>
                </CSSTransition>
              </TransitionGroup>
        )} />
      </BrowserRouter>
    );
  }
}

export default Layout;
