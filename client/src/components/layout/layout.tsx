import React, { Component } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Login from "../login/login";
import Register from "../register/register";
import Vacations from "../vacations/vacations";
import Insert from "../admin/insert/insert";
import Charts from "../admin/charts/charts";
import Update from "../admin/update/update";
import  PageNotFound  from "../page-not-found/page-not-found";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./layout.scss";
 
 
export class Layout extends Component {
  render() {
    return (
      <BrowserRouter>
        <Route
          render={({ location }) => (
            <TransitionGroup component={null}>
              <CSSTransition
                key={location.key}
                timeout={5000}
                classNames="slide"
              >
                <Switch location={location}>
                  <Route path="/login" component={Login} exact></Route>
                  <Route path="/register" component={Register} exact></Route>
                  <Route path="/user/:id" component={Vacations} exact></Route>
                  <Route path="/admin" component={Vacations} exact></Route>
                  <Route path="/admin/charts" component={Charts} exact></Route>
                  <Route path="/admin/vacation-new" component={Insert} exact ></Route>
                  <Route path="/admin/vacation/:id" component={Update} exact ></Route>
                  <Redirect from="/" to="/login" exact></Redirect>
                  <Route component={PageNotFound} exact />
                </Switch>
              </CSSTransition>
            </TransitionGroup>
          )}
        />
      </BrowserRouter>
    );
  }
}

export default Layout;
