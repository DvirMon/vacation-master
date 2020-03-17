import React, { Component } from "react";
import "./admin.scss";
import AppTop from "../app-top/app-top";
import { UserModel } from "../../models/user-model";
import { deleteRequest } from "../../services/server";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Insert from "./insert/insert";
import { login, getStorage } from "../../services/login";
import { VacationModel } from "../../models/vacations-model";
import Vacations from "../vacations/vacations";

interface AdminState {
  admin: UserModel;
  dbToken: {
    id: number;
    refreshToken: string;
  };
}

export class Admin extends Component<any, AdminState> {
  constructor(props: any) {
    super(props);

    this.state = {
      admin: null,
      dbToken: null
    };
  }

  public componentDidMount = async () => {
    const user = getStorage();

    if (!user || user.isAdmin === 0) {
      this.props.history.push("/login");
      console.log("Not Admin");
    }
    const response = await login(user);

    this.setState({
      admin: user,
      dbToken: response.dbToken
    });
  };

  render() {
    const { admin } = this.state;
    return (
      <div className="admin">
        <BrowserRouter>
          <nav>
            <AppTop
              userInfo={admin}
              admin={true}
              handleLogOut={this.handleLogOut}
            ></AppTop>
          </nav>
          <Switch>
            <main>
              <Route path="/admin" component={Insert} exact></Route>
              <Route
                path="/admin/new-vacation"
                component={Insert}
                exact
              ></Route>
            </main>
          </Switch>
          <footer></footer>
        </BrowserRouter>
      </div>
    );
  }

  public handleLogOut = async () => {
    const dbToken = { ...this.state.dbToken };

    const url = `http://localhost:3000/api/tokens/${dbToken.id}`;
    await deleteRequest(url);

    localStorage.clear();

    this.props.history.push("/login");
  };
}

export default Admin;
