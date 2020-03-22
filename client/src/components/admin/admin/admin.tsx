import React, { Component } from "react";
import "./admin.scss";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { logOutService, getStorage } from "../../../services/login";
import AppTop from "../../app-top/app-top/app-top";
import Insert from "../insert/insert";
import Vacations from "../../vacations/vacations";
import { UserModel } from "../../../models/user-model";
import { TokensModel } from "../../../models/tokens.model";
import Update from "../update/update";
import Charts from "../charts/charts";

import { Unsubscribe } from "redux";
import { store } from "../../../redux/store/store";


interface AdminState {
  admin: UserModel;
  tokens: TokensModel;
}

export class Admin extends Component<any, AdminState> {

  private unsubscribeStore: Unsubscribe;

  constructor(props: any) {
    super(props);

    this.state = {
      admin: store.getState().user,
      tokens: store.getState().tokens
    };

    this.unsubscribeStore = store.subscribe(() => {
      this.setState({
        admin: store.getState().user,
        tokens: store.getState().tokens
      });
    });
  }

  public componentDidMount = async () => {
    const user = getStorage();

    if (!user || user.isAdmin === 0) {
      this.props.history.push("/login");
      console.log("Not Admin");
    }
  };

  public componentWillUnmount(): void {
    const controller = new AbortController();
    controller.abort();
    this.unsubscribeStore();
  }

  render() {
    const { admin } = this.state;
    return (
      <div className="admin">
        <BrowserRouter>
          <nav> 
            <AppTop
              user={true}
              admin={true}
              userInfo={admin}
              logo={"Travel-on"}
              handleLogOut={this.handleLogOut}
            ></AppTop>
          </nav>
          <main>
            <Switch>
              <Route path="/admin" component={Vacations} exact></Route>
              <Route
                path="/admin/charts"
                component={Charts}
                exact
              ></Route>
              <Route
                path="/admin/vacation-new"
                component={Insert}
                exact
              ></Route>
              <Route
                path="/admin/vacation/:id"
                component={Update}
                exact
              ></Route>
            </Switch>
          </main>
          <footer></footer>
        </BrowserRouter>
      </div>
    );
  }

  public handleLogOut = async () => {
    const tokens = { ...this.state.tokens };
    const history = this.props.history;
    await logOutService(tokens, history);
  };
}

export default Admin;
