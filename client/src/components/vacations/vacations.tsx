import React, { Component } from "react";
import { UserVacationModel } from "../../models/vacations-model";
import { UserModel } from "../../models/user-model";
import { TokensModel } from "../../models/tokens.model";
import VacCard from "../vac-card/vac-card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { deleteRequest } from "../../services/serverService";
import { refreshToken, getTokens } from "../../services/tokensService";
import { getVacations } from "../../services/vacationsService";
import { getStorage, logOutService } from "../../services/loginService";
import { store } from "../../redux/store/store";
import { Action } from "../../redux/action/action";
import { ActionType } from "../../redux/action-type/action-type";
import { Unsubscribe } from "redux";
import "./vacations.scss";

interface VacationsProps {
  handleFollowUpCounter?(followUpCounter: number): void;
}

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
      // first request for tokens
      const user = getStorage();

      const action: Action = {
        type: ActionType.addUser,
        payloud: user
      };
      store.dispatch(action);

      const tokens = await getTokens(user);
      const response = await getVacations(tokens.accessToken);

      const vacations = this.handleResponse(response);
      const followIcon = this.handelRole();

      // update state
      this.setState({
        followUp: vacations.followUp,
        unFollowUp: vacations.unFollowUp,
        followIcon
      });

      if (vacations.followUp.length > 0) {
        this.props.handleFollowUpCounter(vacations.followUp.length);
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

  public handleResponse = response => {
    // validate response
    switch (typeof response) {
      case "string":
        alert(response);
        this.props.history.push("/");
      case "object":
        return response;
    }
  };

  public handelRole = () => {
    const user = store.getState().user;
    if (user.isAdmin === 1) {
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
        { unFollowUp.length === 0 ? (  
          <img src="/assets/img/loader.gif" style={{width: "100px", height : "100px"}} /> 
        ) : ( 
          <React.Fragment>
            <Row>
              {followUp.length > 0 && (
                <h1 className="card-title">My Wish List</h1>
              )}
            </Row>
            <Row className="row-followed">
              {followUp.map(vacation => (
                <Col key={vacation.vacationID} sm={3}>
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
              {unFollowUp.length > 0 && (
                <h1 className="card-title">Explore Our Vacations</h1>
              )}
            </Row>
            <Row className="row-unFollowed">
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
          </React.Fragment>
        )}
      </div>
    );
  }

  public handleLogOut = async () => {
    const tokens = { ...this.state.tokens };
    const history = this.props.history;
    await logOutService(tokens, history);
  };

  public handleDelete = async (vacationID: number) => {
    const tokens = { ...this.state.tokens };
    const answer = window.confirm("Are You Sure yoe?");

    if (!answer) {
      return;
    }

    const url = `http://localhost:3000/api/vacations/${vacationID}`;
    await deleteRequest(url, tokens.accessToken);
    this.componentDidMount();
  };

  public handleEdit = (vacationID: number) => {
    this.props.history.push(`/admin/vacation/${vacationID}`);
  };
}

export default Vacations;
