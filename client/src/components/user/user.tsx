import React, { Component } from "react";

import { UserVacationModel } from "../../models/vacations-model";
import { UserModel } from "../../models/user-model";
import { AppTop } from "../app-top/app-top/app-top";
import VacCard from "../vac-card/vac-card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { deleteRequest } from "../../services/server";
import { refreshToken, getTokens } from "../../services/tokens";
import { getStorage, logOutService, getVacations } from "../../services/login";
import { TokensModel } from "../../models/tokens.model";
import { store } from "../../redux/store/store";
import { Action } from "../../redux/action/action";
import { ActionType } from "../../redux/action-type/action-type";
import { Unsubscribe } from "redux";
import Vacations from "../vacations/vacations";
import "./user.scss";
import { BrowserRouter, Route } from "react-router-dom";
import { Switch } from "@material-ui/core";

interface UserState {
  followUp?: UserVacationModel[];
  unFollowUp?: UserVacationModel[];
  user: UserModel;
  followIcon: boolean;
  tokens: TokensModel;
}

export class User extends Component<any, UserState> {
  private unsubscribeStore: Unsubscribe;

  constructor(props: any) {
    super(props);

    this.state = {
      followUp: [],
      unFollowUp: [],
      user: store.getState().user,
      tokens: store.getState().tokens,
      followIcon: false
    };
    this.unsubscribeStore = store.subscribe(() => {
      this.setState({
        user: store.getState().user,
        tokens: store.getState().tokens
      });
    });
  }

  public componentDidMount = async () => {
    try {
      const user = getStorage();

      if (!user) {
        this.props.history.push("/");
      }

      // first request for tokens
      const tokens = await getTokens(user);

      // this.handleResponse(vacations);
    } catch (err) {
      console.log(err);
    }
  };

  public componentWillUnmount(): void {
    const controller = new AbortController();
    controller.abort();
    this.unsubscribeStore();
  }

  public handleResponse = vacations => {};

  render() {
    const { user, followUp } = this.state;
    return (
      <div className="user-page">
          <nav>
          <AppTop
              user={true}
              admin={false}
              userInfo={user} 
              logo={"Travel-on"}
              handleLogOut={this.handleLogOut}
            ></AppTop>
          </nav>

          <main>
            <Vacations/>
          </main>
      </div>
    );
  }

  public handleLogOut = async () => {
    const tokens = { ...this.state.tokens };
    const history = this.props.history;
    await logOutService(tokens, history);
  };
}

export default User;
