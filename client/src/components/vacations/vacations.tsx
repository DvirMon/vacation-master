import React, { Component } from "react";

// import components
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import VacCard from "../vac-card/vac-card";
import Loader from "../loader/loader";
import Slider from "react-slick";
import UpdateToken from "../updateToken/updateToken";

// import services
import { ServerServices } from "../../services/serverService";
import { VacationService } from "../../services/vacationsService";
import { LoginServices } from "../../services/loginService";
import { TokensServices } from "../../services/tokensService";
import { invokeConnection } from "../../services/socketService";
import { setStyle } from "../../services/styleServices";

// import models
import { UserVacationModel } from "../../models/vacations-model";
import { UserModel } from "../../models/user-model";
import { TokensModel } from "../../models/tokens.model";
import { MenuModel, AdminMenu } from "../../models/menu-model";
import { SliderModel } from "../../models/slider-model";

// import redux
import { Unsubscribe } from "redux";
import { store } from "../../redux/store";
import { ActionType } from "../../redux/action-type";

import "./vacations.scss";

interface VacationsState {
  user: UserModel;
  admin: boolean;
  tokens: TokensModel;
  unFollowUp: UserVacationModel[];
  followUp: UserVacationModel[];
  menu: MenuModel;
  sliderSetting: SliderModel;
}

export class Vacations extends Component<any, VacationsState> {
  // unsubscribe to store
  private unsubscribeStore: Unsubscribe;

  constructor(props: any) {
    super(props);

    this.state = {
      user: store.getState().login.user,
      admin: store.getState().login.admin,
      tokens: store.getState().auth.tokens,
      followUp: store.getState().vacation.followUp,
      unFollowUp: store.getState().vacation.unFollowUp,
      sliderSetting: store.getState().style.sliderSetting,
      menu: AdminMenu,
    };
  }

  public componentDidMount = async () => {
    try {
      // verify login
      if (store.getState().login.isLoggedIn === false) {
        this.props.history.push("/");
        return;
      }

      // subscribe to store
      this.unsubscribeStore = store.subscribe(() => {
        this.setState({
          user: store.getState().login.user,
          admin: store.getState().login.admin,
          tokens: store.getState().auth.tokens,
          followUp: store.getState().vacation.followUp,
          unFollowUp: store.getState().vacation.unFollowUp,
          sliderSetting: store.getState().style.sliderSetting,
        });
      });

      const { user, admin } = this.state;

      await this.handleAuth(user, admin);

      if (store.getState().vacation.unFollowUp.length === 0) {
        await this.handleRequest();
      }

      this.handleStyle(admin);
    } catch (err) {
      console.log(err);
    }
  };

  public componentWillUnmount(): void {
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
    }
  }

  // invoke socket, set tokens, verify path
  public handleAuth = async (user, admin) => {
    invokeConnection();
    await TokensServices.getTokens(user);
    LoginServices.verifyPath(admin, user, this.props.history);
  };
  // end of function

  public handleRequest = async () => {
    const tokens = store.getState().auth.tokens;

    // send request
    const response = await VacationService.getVacationsAsync(
      tokens.accessToken
    );

    // handle server response
    ServerServices.handleServerResponse(
      response,
      () => this.handleServerSuccess(response),
      () => this.handleServerError()
    );
  };


  public handleServerSuccess = (response) => {
    const action = {
      type: ActionType.getAllVacation,
      payload: response.body,
    };
    store.dispatch(action);
  };

  public handleServerError = () => {
    this.props.history.push("/logout");
  };

  render() {
    const { followUp, unFollowUp, sliderSetting, admin } = this.state;

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
            <Row>
              <Slider {...sliderSetting}>
                {followUp.map((vacation) => (
                  <Col className="followed" key={vacation.vacationID}>
                    <VacCard
                      vacation={vacation}
                      follow={true}
                      followIcon={true}
                    ></VacCard>
                  </Col>
                ))}
              </Slider>
            </Row>
            <Row>
              {!admin && <h1 className="card-title">Explore Our Vacations</h1>}
            </Row>
            <Row className="row-unFollowed">
              {unFollowUp.map((vacation) => (
                <Col key={vacation.vacationID} sm={4}>
                  <VacCard
                    vacation={vacation}
                    follow={false}
                    followIcon={!admin}
                    margin={true}
                    hover={!admin}
                    admin={admin}
                  ></VacCard>
                </Col>
              ))}
            </Row>

            <UpdateToken />
          </div>
        )}
      </React.Fragment>
    );
  }

  public handleStyle = (admin) => {
    SliderModel.updateSliderSetting();
    setStyle(MenuModel.setMenu(admin), admin ? "admin" : "user");
  };
}

export default Vacations;
