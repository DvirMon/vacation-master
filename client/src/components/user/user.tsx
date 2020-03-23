import React, { Component } from "react";
import { UserVacationModel } from "../../models/vacations-model";
import { UserModel } from "../../models/user-model";
import { AppTop } from "../app-top/app-top/app-top";
import { getTokens } from "../../services/tokensService";
import { getStorage, logOutService } from "../../services/loginService";
import { TokensModel } from "../../models/tokens.model";
import { store } from "../../redux/store/store";
import { Unsubscribe } from "redux";
import Vacations from "../vacations/vacations";
import "./user.scss";
import { Action } from "history";

interface UserState {
  followUp?: UserVacationModel[];
  unFollowUp?: UserVacationModel[];
  user: UserModel;
  followUpCounter: number;
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
      followUpCounter: 0
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
    } catch (err) {
      console.log(err);
    }
  };

  public componentWillUnmount(): void {
    const controller = new AbortController();
    controller.abort();
    this.unsubscribeStore();
  }

  render() {
    const { user, followUpCounter } = this.state;
    return (
      <div className="user-page">
        <nav>
          <AppTop
            user={true}
            admin={false}
            userInfo={user}
            logo={"Travel-on"}
            followUpCounter={followUpCounter}
            handleLogOut={this.handleLogOut}
          ></AppTop>
        </nav>

        <main>
          <Vacations handleFollowUpCounter={this.handleFollowUpCounter} />
        </main>
      </div>
    );
  }

  public handleFollowUpCounter = (followUpCounter: number) => {
    this.setState({ followUpCounter });
  };

  public handleLogOut = async () => {
    const tokens = { ...this.state.tokens };
    const history = this.props.history;
    await logOutService(tokens, history);
  };
}

export default User;
