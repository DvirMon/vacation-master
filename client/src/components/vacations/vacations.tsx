import React, { Component } from "react";
import { UserVacationModel } from "../../models/vacations-model";
import { UserModel } from "../../models/user-model";
import { TokensModel } from "../../models/tokens.model";
import VacCard from "../vac-card/vac-card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { deleteRequest } from "../../services/serverService";
import { getVacations } from "../../services/vacationsService";
import { verifyAdminPath, verifyUserPath, handleServerResponse } from "../../services/loginService";
import Loader from "../loader/loader";
import { getTokens, getAccessToken } from "../../services/tokensService";
import { Unsubscribe } from "redux";
import { store } from "../../redux/store/store";
import { MenuModel } from "../../models/menu-model";
import { ActionType } from "../../redux/action-type/action-type";
import "./vacations.scss";

interface VacationsProps {
  handleFollowUpCounter?(followUpCounter: number): void;
}

interface VacationsState {
  user: UserModel;
  admin: boolean;
  followUpCounter: number;
  followUp?: UserVacationModel[];
  unFollowUp?: UserVacationModel[];
  followIcon: boolean;
  tokens: TokensModel;
  scrolled: boolean;
  scrollPixelsY: number;
  menu: MenuModel;
}

export class Vacations extends Component<any, VacationsState> {
  private unsubscribeStore: Unsubscribe;

  constructor(props: any) {
    super(props);

    this.state = {
      user: store.getState().user,
      admin: false,
      tokens: store.getState().tokens,
      followUp: [],
      unFollowUp: [],
      followUpCounter: 0,
      followIcon: true,
      scrolled: true,
      scrollPixelsY: 0,
      menu: null
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
      // verify login
      if (store.getState().isLoggedIn === false) {
        this.props.history.push("/");
        return;
      }

      // unable for client to change routes
      const user = store.getState().user;
      if (user.isAdmin === 1) {
        verifyAdminPath(this.props.history);
      } else {
        verifyUserPath(user, this.props.history);
      }

      // get tokens
      if (store.getState().tokens === null) {
        await getTokens(store.getState().user);
      }

      // send request for vacations
      const tokens = store.getState().tokens;
      const response = await getVacations(tokens.accessToken);

      // handle response - if true there is an error
 
      if(handleServerResponse(response)) {
        alert(response)
        this.props.history.push("/logout");
        return
      } 
 
      // const vacations = this.handleResponse(response);

      // update page according to client role
      const admin = this.handelRole();

      // update state
      this.setState({
        admin, 
        followUpCounter: response.followUp.length,
        followUp: response.followUp,
        unFollowUp: response.unFollowUp
      });

      // update menu according to client role
      this.handleMenu();
    } catch (err) {
      console.log(err);
    }
  };

  public componentWillUnmount(): void {
    this.unsubscribeStore();
    clearInterval(this.handleTokens);
  }

  // update tokens every 10 min
  public handleTokens = setInterval(async () => {
    const tokens = JSON.parse(sessionStorage.getItem("tokens"));
    if (!tokens) {
      return;
    }
    await getAccessToken(tokens);
    console.log(store.getState().tokens.accessToken);
  }, 600000);

  public handleResponse = response => {
    // verify response in case token has expired
    switch (typeof response) {
      case "string":
        this.props.history.push("/logout");
        break;
      case "object":
        return response;
    }
  };

  public handelRole = () => {
    const user = store.getState().user;
    if (user.isAdmin === 1) {
      store.dispatch({ type: ActionType.updateBackground, payload: "" });
      return true;
    }
    store.dispatch({ type: ActionType.updateBackground, payload: "user" });
    return false;
  }; 

  // update menu according to role
  public handleMenu = () => {
    const menu = store.getState().menu;
    menu.user = this.state.user;
    menu.admin = this.state.admin;
    menu.isLoggedIn = true;
    menu.followUpCounter = this.state.followUp.length;
    menu.logoutButton = true;
    store.dispatch({ type: ActionType.updateMenu, payload: menu });
  };



  render() {
    const { followUp, unFollowUp, admin, tokens } = this.state;

    return (
      <React.Fragment>
        {unFollowUp.length === 0 ? (
          <Loader />
        ) : (
          <div className="vacations">
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
                    accessToken={tokens ? tokens.accessToken : ""}
                    follow={true}
                    update={this.componentDidMount}
                    followIcon={true}
                  ></VacCard>
                </Col>
              ))}
            </Row>
            <Row>
              {unFollowUp.length > 0 ||
                (admin && (
                  <h1 className="card-title">Explore Our Vacations</h1>
                ))}
            </Row>
            <Row className="row-unFollowed">
              {unFollowUp.map(vacation => (
                <Col key={vacation.vacationID} sm={4}>
                  <VacCard
                    vacation={vacation}
                    accessToken={tokens ? tokens.accessToken : ""}
                    follow={false}
                    followIcon={!admin}
                    hover={!admin}
                    admin={admin}
                    handleDelete={this.handleDelete}
                    handleEdit={this.handleEdit}
                    update={this.componentDidMount}
                  ></VacCard>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </React.Fragment>
    );
  }

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

  public handleScroll = () => {
    const isTop = window.scrollY < 100;
    if (isTop) {
      this.setState({ scrolled: false });
    } else {
      this.setState({ scrolled: true });
    }

    this.setState({
      scrollPixelsY: window.scrollY
    });
  };
}

export default Vacations;
