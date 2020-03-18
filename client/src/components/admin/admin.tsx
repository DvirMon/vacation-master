import React, { Component } from "react";
import "./admin.scss";
import AppTop from "../app-top/app-top";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Vacations from "../vacations/vacations";
import Insert from "./insert/insert";
import { UserModel } from "../../models/user-model";
import { TokensModel } from "../../models/tokens.model";
import { logOutService, login, getStorage } from "../../services/login";

interface AdminState {
  admin: UserModel;
  tokens: TokensModel;
}

export class Admin extends Component<any, AdminState> {
  constructor(props: any) {
    super(props);

    this.state = {
      admin: null,
      tokens: null
    };
  }

  public componentDidMount = async () => {
    
    const user = getStorage();

    if (!user || user.isAdmin === 0) {
      this.props.history.push("/login");
      console.log("Not Admin");
    }
    const response = await login(user);
    const tokens = response.tokens;

    this.setState({
      admin: user,
      tokens: tokens
    });
  };

  render() {
    const { admin, tokens } = this.state;
    return (
      <div className="admin">
        <BrowserRouter>
          <nav>
            <AppTop
              userInfo={admin}
              admin={true}
              tokens={tokens}
              handleLogOut={this.handleLogOut}
            ></AppTop>
          </nav> 
          <Switch>
            <main>
              <Route path="/admin" component={Vacations} exact></Route>
              <Route
                path="/admin/new-vacation"
                component={Insert}
                exact
              ></Route>
              <Redirect from="/" to="/admin" ></Redirect>
            </main>
          </Switch>
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
