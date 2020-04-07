import React, { Component } from "react";
import clsx from "clsx";

// import components
import Login from "../login/login";
import Register from "../register/register";
import Menu from "../menu/menu/menu";
import Vacations from "../vacations/vacations";
import Insert from "../admin/insert/insert";
import Charts from "../admin/charts/charts";
import Update from "../admin/update/update";
import Logout from "../logout/logout";
import PageNotFound from "../page-not-found/page-not-found";

// import router
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

// import  service
import SocketContext from "../../services/socketServices";

// import redux
import { Unsubscribe } from "redux";
import { store } from "../../redux/store";

// client socket.io
import io from "socket.io-client";

import "./layout.scss";

interface LayoutState {
  backgroundImage: string;
}

export class Layout extends Component<any, LayoutState> {
  private unsubscribeStore: Unsubscribe;

  // private socket = io.connect("http://localhost:3000")
  
  constructor(props) {
    super(props);

    this.state = {
      backgroundImage: store.getState().style.backgroundImage,
    };
  }

  public componentDidMount = () => {
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
      <SocketContext.Provider value={true}>
        <div className={clsx("layout", "bg", `${backgroundImage}`)}>
          <BrowserRouter>
            <nav>
              <Menu />
            </nav>
            <main>
              <Switch>
                <Route path="/login" component={Login} exact></Route>
                <Route path="/register" component={Register} exact></Route>
                <Route path="/logout" component={Logout} exact></Route>
                <Route path="/user/:id" component={Vacations} exact></Route>
                <Route path="/admin" component={Vacations} exact></Route>
                <Route path="/admin/charts" component={Charts} exact></Route>
                <Route
                  path="/admin/vacation/new"
                  component={Insert}
                  exact
                ></Route>
                <Route
                  path="/admin/vacation/:id"
                  component={Update}
                  exact
                ></Route>
                <Redirect from="/" to="/login" exact></Redirect>
                <Route component={PageNotFound} exact />
              </Switch>
            </main>
          </BrowserRouter>
        </div>
      </SocketContext.Provider>
    );
  }
}

export default Layout;
