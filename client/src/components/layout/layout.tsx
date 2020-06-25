import React, { Component } from "react";

import clsx from "clsx";

// import components
import Login from "../auth/login/login";
import Register from "../auth/register/register";
import Menu from "../menu/menu/menu";
import Vacations from "../vacations/vacations";
import Insert from "../admin/insert/insert";
import Charts from "../admin/charts/charts";
import Update from "../admin/update/update";
import PageNotFound from "../my-components/page-not-found/page-not-found";
import history from '../../history';

// import router
import { Switch, Route, Redirect, Router } from "react-router-dom";

// import redux
import { Unsubscribe } from "redux";
import { store } from "../../redux/store";

import "./layout.scss";

interface LayoutState {
  backgroundImage: string;
}

export class Layout extends Component<any, LayoutState> {
  private unsubscribeStore: Unsubscribe;

  constructor(props) {
    super(props);

    this.state = {
      backgroundImage: store.getState().style.backgroundImage,
    };
  }

  public componentDidMount = async () => {
    this.unsubscribeStore = store.subscribe(() =>
      this.setState({
        backgroundImage: store.getState().style.backgroundImage,
      })
    );

 
  };

  public componentWillUnmount(): void {
    this.unsubscribeStore();
  }

  render() {
    const { backgroundImage } = this.state;

    return (
      <div className={clsx("layout", "bg", `${backgroundImage}`)}>
        <Router history={history}>
          <nav>
            <Menu />
          </nav>
          <main>
            <Switch>
              <Route path="/login" component={Login} exact></Route>
              <Route path="/register" component={Register} exact></Route>
              <Route
                path="/user/:id"
                component={Vacations}
                meta={{ auth: true }}
                exact
              ></Route>
              <Route
                path="/admin"
                component={Vacations}
                meta={{ auth: true }}
                exact
              ></Route>
              <Route
                path="/admin/charts"
                component={Charts}
                meta={{ auth: true }}
                exact
              ></Route>
              <Route
                path="/admin/vacation/new"
                component={Insert}
                meta={{ auth: true }}
                exact
              ></Route>
              <Route
                path="/admin/vacation/:id"
                meta={{ auth: true }}
                component={Update}
                exact
              ></Route>
              <Redirect from="/" to="/login" exact></Redirect>
              <Route component={PageNotFound} exact />
            </Switch>
          </main>
        </Router>
      </div>
    );
  }
}

export default Layout;
