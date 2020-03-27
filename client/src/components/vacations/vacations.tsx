import React, { Component } from "react";

// import components
import VacCard from "../vac-card/vac-card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Loader from "../loader/loader";

// import services
import { deleteRequest, handleServerResponse } from "../../services/serverService";
import { getVacations } from "../../services/vacationsService";
import { verifyAdminPath, verifyUserPath, handelStyle} from "../../services/loginService";
import { getTokens, getAccessToken } from "../../services/tokensService";

// import models
import { UserVacationModel } from "../../models/vacations-model";
import { UserModel } from "../../models/user-model";
import { TokensModel } from "../../models/tokens.model";
import { MenuModel ,UserMenu, AdminMenu} from "../../models/menu-model";

// import redux
import { Unsubscribe } from "redux";
import { store } from "../../redux/store/store";
import { ActionType } from "../../redux/action-type/action-type";
import "./vacations.scss";

interface VacationsProps {
  handleFollowUpCounter?(followUpCounter: number): void;
}

interface VacationsState {
  user: UserModel;
  admin: boolean;
  followUp?: UserVacationModel[];
  unFollowUp?: UserVacationModel[];
  followIcon: boolean;
  tokens: TokensModel;
  scrolled: boolean;
  scrollPixelsY: number;
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
      followIcon: true,
      scrolled: true,
      scrollPixelsY: 0
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
      console.log(response);

      // handle response - if true there is an error

      if (handleServerResponse(response)) {
        alert(response);
        this.props.history.push("/logout");
        return;
      }

      const vacations = response.body;

      // update page according to client role
      const admin = handelStyle();

      // update state
      this.setState({
        admin,
        followUp: vacations.followUp,
        unFollowUp: vacations.unFollowUp
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
  }, 60000);

  // update menu according to role
  public handleMenu = () => {
    const { user } = this.state;
    
    let menu : MenuModel; 
    if(user.isAdmin === 0) {
      menu = {...UserMenu}
      menu.user = user;
      menu.followUpCounter = this.state.followUp.length;
    } else {
      menu = {...AdminMenu}
    }
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
              {!admin && <h1 className="card-title">Explore Our Vacations</h1>}
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
