import React, { Component } from "react";

// import components
import VacCard from "../vac-card/vac-card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Loader from "../loader/loader";

// import services
import { ServerServices } from "../../services/serverService";
import { VacationService } from "../../services/vacationsService";
import { LoginServices } from "../../services/loginService";
import { TokensServices } from "../../services/tokensService";

// import models
import { UserVacationModel } from "../../models/vacations-model";
import { UserModel } from "../../models/user-model";
import { TokensModel } from "../../models/tokens.model";
import { MenuModel, AdminMenu } from "../../models/menu-model";

// import redux
import { Unsubscribe } from "redux";
import { store } from "../../redux/store";
import { ActionType } from "../../redux/action-type";
import "./vacations.scss";

interface VacationsState {
  user: UserModel;
  admin: boolean;
  tokens: TokensModel;
  followUp?: UserVacationModel[];
  unFollowUp?: UserVacationModel[];
  menu: MenuModel;
}

export class Vacations extends Component<any, VacationsState> {
  private unsubscribeStore: Unsubscribe;

  constructor(props: any) {
    super(props);

    this.state = {
      user: store.getState().auth.user,
      admin: store.getState().auth.admin,
      tokens: store.getState().auth.tokens,
      followUp: store.getState().vacation.followUp,
      unFollowUp: store.getState().vacation.unFollowUp,
      menu: AdminMenu
    };
  }

  public componentDidMount = async () => {
    try {
      // subscribe to store
      this.unsubscribeStore = store.subscribe(() => {
        this.setState({
          user: store.getState().auth.user,
          admin: store.getState().auth.admin,
          tokens: store.getState().auth.tokens,
          followUp: store.getState().vacation.followUp,
          unFollowUp: store.getState().vacation.unFollowUp
        });
      });

      // verify login
      if (store.getState().auth.isLoggedIn === false) {
        this.props.history.push("/");
        return;
      }

      const user = store.getState().auth.user;
      const tokens = store.getState().auth.tokens;
      const admin = store.getState().auth.admin
 

      // unable for client to navigate to other route
      if (admin) {
        LoginServices.verifyAdminPath(this.props.history);
      } else {
        LoginServices.verifyUserPath(user, this.props.history);
      }

      // send request for vacations
      if (store.getState().vacation.unFollowUp.length === 0) {
        const response = await VacationService.getVacationsAsync(
          tokens.accessToken
        );

        // handle response - if true there is an error
        if (ServerServices.handleServerResponse(response)) {
          alert(response);
          this.props.history.push("/logout");
          return;
        }

        // if false response.body is the vacation object
        const action = {
          type: ActionType.getAllVacation,
          payload: response.body
        };
        store.dispatch(action);
        
      }
        // update background and menu according to client role
        MenuModel.setMenu(user, store.getState().vacation.followUp.length);
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
    const tokens = store.getState().auth.tokens;
    await TokensServices.getAccessToken(tokens);
  }, 360000);

  render() {
    const { followUp, unFollowUp, admin } = this.state;

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
                    follow={true}
                    update={this.updateMenu}
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
                    follow={false}
                    followIcon={!admin}
                    hover={!admin}
                    admin={admin}
                    update={this.updateMenu}
                  ></VacCard>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </React.Fragment>
    );
  }

  // function for update followup icon in menu
  public updateMenu = () => {
    const menu = store.getState().style.menu;
    menu.followUpCounter = store.getState().vacation.followUp.length;
    const action = { type: ActionType.updateMenu, payload: menu };
    store.dispatch(action);
  };
  // end of function
}

export default Vacations;
