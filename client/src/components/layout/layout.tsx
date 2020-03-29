import React, { Component } from "react";

import Login from "../login/login";
import Register from "../register/register";
import Vacations from "../vacations/vacations";
import Insert from "../admin/insert/insert";
import Charts from "../admin/charts/charts";
import Update from "../admin/update/update";
import PageNotFound from "../page-not-found/page-not-found";
import Logout from "../logout/logout";
import Menu from "../menu/menu/menu";

import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import { store } from "../../redux/store/store";
import { Unsubscribe } from "redux";

import clsx from "clsx";
import "./layout.scss";

interface LayoutState {
  backgroundImage: string;
  filter: boolean;
}

export class Layout extends Component<any, LayoutState> {
  private unsubscribeStore: Unsubscribe;

  constructor(props) {
    super(props);

    this.state = {
      backgroundImage: store.getState().backgroundImage,
      filter: store.getState().filter
    };
  }

  public componentDidMount = () => {

    this.unsubscribeStore = store.subscribe(() =>
      this.setState({
        backgroundImage: store.getState().backgroundImage,
        filter: store.getState().filter
      })
    );
  };

  public componentWillUnmount(): void {
    this.unsubscribeStore();
  }

  render() {
    const { backgroundImage, filter } = this.state;
    return (
      <div
        className={clsx(
          "layout",
          "bg",
          `${backgroundImage}`
        )}
      >
        <BrowserRouter>
          <nav>
            <Menu />
          </nav>
          <main>
            <Switch>
              <Route path="/login" component={Login} exact></Route>
              <Route path="/register" component={Register} exact></Route>
              <Route path="/logout" component={Logout} exact></Route>
              <Route path="/admin" component={Vacations} exact></Route>
              <Route path="/user/:id" component={Vacations} exact></Route> 
              <Route path="/admin/charts" component={Charts} exact></Route>
              <Route path="/admin/vacation/new" component={Insert} exact></Route>
              <Route path="/admin/vacation/:id" component={Update} exact ></Route>
              <Redirect from="/" to="/login" exact></Redirect>
              <Route component={PageNotFound} exact />
            </Switch>
          </main>
        </BrowserRouter>
      </div>
    );
  }
}

export default Layout;
