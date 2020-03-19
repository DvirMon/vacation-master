import React, { Component } from "react";
import { VacationModel, UserVacationModel } from "../../models/vacations-model";
import { UserModel } from "../../models/user-model";
import { AppTop } from "../app-top/app-top/app-top";
import VacCard from "../vac-card/vac-card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { deleteRequest } from "../../services/server";
import { refreshToken } from "../../services/tokens";
import { login, getStorage, logOutService } from "../../services/login";
import "./vacations.scss";
import { TokensModel } from "../../models/tokens.model";
import { store } from "../../redux/store/store";
import { Action } from "../../redux/action/action";
import { ActionType } from "../../redux/action-type/action-type";
import { Unsubscribe } from "redux";

interface VacationsState {
  followUp?: UserVacationModel[];
  unFollowUp?: UserVacationModel[];
  user: UserModel;
  followIcon: boolean;
  tokens: TokensModel;
}

export class Vacations extends Component<any, VacationsState> {
  private unsubscribeStore: Unsubscribe;

  constructor(props: any) {
    super(props);

    this.state = {
      followUp: [],
      unFollowUp: [],
      user: null,
      tokens: store.getState().tokens,
      followIcon: false
    };
    this.unsubscribeStore = store.subscribe(() => {
      this.setState({ tokens: store.getState().tokens });
    });
  }

  public componentDidMount = async () => {
    try {
      const user = getStorage();

      if (!user) {
        this.props.history.push("/");
      }
      const response = await login(user);

      this.handleResponse(response);

      // add to store
      const action: Action = {
        type: ActionType.addToken,
        payloud: response.tokens
      };
      store.dispatch(action);

      this.setState({ user });
    } catch (err) {
      console.log(err);
    }
  };

  public componentWillUnmount(): void {
    const controller = new AbortController();
    controller.abort();
    this.unsubscribeStore();
  }

  public handleResponse = response => {
    switch (typeof response) {
      case "string":
        this.props.history.push("/login");
        break;
      case "object":
        const followIcon = this.handelRole(response);
        this.setState({
          followIcon,
          followUp: response.vacations.followUp,
          unFollowUp: response.vacations.unFollowUp
        });
        break;
    }
  };

  public handelRole = response => {
    if (response.user.isAdmin === 1) {
      return false;
    }
    return true;
  };

  public handleTokens = setInterval(async () => {
    const tokens = { ...this.state.tokens };
    const accessToken = await refreshToken(tokens.dbToken);
    tokens.accessToken = accessToken;
    // add to store
    const action: Action = {
      type: ActionType.addToken,
      payloud: tokens
    };
    store.dispatch(action);
  }, 600000);

  render() {
    const { followUp, unFollowUp, user, followIcon, tokens } = this.state;

    return (
      <div className="vacations">
        {followIcon && (
          <nav>
            <AppTop
              admin={false}
              tokens={tokens}
              userInfo={user}
              handleLogOut={this.handleLogOut}
              followUpCounter={followUp.length}
            />
          </nav>
        )}
        <main>
          <Row>
            {followUp.length > 0 && (
              <h1 className="card-title">My Wish List</h1>
            )}
          </Row>
          <Row>
            {followUp.map(vacation => (
              <Col key={vacation.vacationID} sm={4}>
                <VacCard
                  vacation={vacation}
                  accessToken={tokens.accessToken}
                  follow={true}
                  update={this.componentDidMount}
                  followIcon={followIcon}
                ></VacCard>
              </Col>
            ))}
          </Row>
          <Row>
            <h1 className="card-title">Our Vacations</h1>
          </Row>
          <Row>
            {unFollowUp.map(vacation => (
              <Col key={vacation.vacationID} sm={4}>
                <VacCard
                  vacation={vacation}
                  accessToken={tokens.accessToken}
                  follow={false}
                  followIcon={followIcon}
                  admin={true}
                  handleDelete={this.handleDelete}
                  handleEdit={this.handleEdit}
                  update={this.componentDidMount}
                ></VacCard>
              </Col>
            ))}
          </Row>
        </main>
      </div>
    );
  }

  public handleLogOut = async () => {
    const tokens = { ...this.state.tokens };
    const history = this.props.history;
    await logOutService(tokens, history);
  };

  public handleDelete = async (vacationID: number) => {

    const tokens = {...this.state.tokens}
    const answer = window.confirm("Are You Sure yoe?")

    if(!answer) {
      return
    }
 
    const url = `http://localhost:3000/api/vacations/${vacationID}`
    await deleteRequest(url, tokens.accessToken)
    this.componentDidMount()
  };

  public handleEdit = (vacationID: number) => {
    this.props.history.push(`/admin/vacation/${vacationID}`);
  };
}

export default Vacations;
