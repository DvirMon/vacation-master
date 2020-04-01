import React, { Component } from "react";

// import components
import VacCard from "../vac-card/vac-card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Loader from "../loader/loader";

// import services
import {
  deleteRequest,
  handleServerResponse
} from "../../services/serverService";
import { VacationService } from "../../services/vacationsService";
import { LoginServices } from "../../services/loginService";
import { TokensServices } from "../../services/tokensService";

// import models
import { UserVacationModel } from "../../models/vacations-model";
import { UserModel } from "../../models/user-model";
import { TokensModel } from "../../models/tokens.model";
import { MenuModel, AdminMenu  } from "../../models/menu-model";

// import redux
import { Unsubscribe } from "redux";
import { store } from "../../redux/store/store";
import "./vacations.scss";

interface VacationsProps {
  handleFollowUpCounter?(followUpCounter: number): void;
}

interface VacationsState {
  user: UserModel;
  admin: boolean;
  menu : MenuModel;
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
      menu : AdminMenu,
      tokens: store.getState().tokens,
      followUp: [],
      unFollowUp: [],
      followIcon: true,
      scrolled: true,
      scrollPixelsY: 0
    };
  }

  public componentDidMount = async () => {
    try {
      // subscribe to store
      this.unsubscribeStore = store.subscribe(() => {
        this.setState({
          user: store.getState().user,
          tokens: store.getState().tokens
        });
      });

      // verify login
      if (store.getState().isLoggedIn === false) {
        this.props.history.push("/");
        return;
      }

      const user = store.getState().user;
      const tokens = store.getState().tokens;
      const admin = LoginServices.handelRole(user)
      
      // unable for client to navigate to other route
      if (admin) {
        LoginServices.verifyAdminPath(this.props.history);
      } else {
        LoginServices.verifyUserPath(user, this.props.history);
      }
      
      // send request for vacations
      const response = await VacationService.getVacationsAsync(tokens.accessToken);
      
      // handle response - if true there is an error
      if (handleServerResponse(response)) {
        alert(response);
        this.props.history.push("/logout");
        return;
      }
      
      // if false response.body is vacation object
      const vacations = response.body;

      
      // update state
      this.setState({
        admin,
        followUp: vacations.followUp,
        unFollowUp: vacations.unFollowUp
      });
      
      // update background and menu according to client role
      MenuModel.setMenu(user,  vacations.followUp.length);
      LoginServices.handelBackground(admin);

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
    const tokens = store.getState().tokens;
    console.log(tokens);
    console.log("-------");
    await TokensServices.getAccessToken(tokens);
    console.log(store.getState().tokens.accessToken);
  }, 600000);


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

  public handleDelete = async () => {
    const vacationID = store.getState().deleteID;
    const tokens = { ...this.state.tokens };
    const answer = window.confirm("Are You Sure yoe?");

    if (!answer) {
      return;
    }

    const url = `http://localhost:3000/api/vacations/${vacationID}`;
    await deleteRequest(url, tokens.accessToken);
    this.componentDidMount();
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
