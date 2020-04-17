import React, { Component } from "react";

// import components
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import VacCard from "../vac-card/vac-card";
import Loader from "../loader/loader";
import Slider from "react-slick";
import UpdateToken from "../updateToken/updateToken";

// import services
import { AuthServices } from "../../services/auth-service";
import { VacationService } from "../../services/vacations-service";
import { LoginServices } from "../../services/login-service";
import { invokeConnection } from "../../services/socket-service";
import { setStyle } from "../../services/style-services";

// import models
import { UserVacationModel } from "../../models/vacations-model";
import { UserModel } from "../../models/user-model";
import { TokensModel } from "../../models/tokens.model";
import { MenuModel, AdminMenu } from "../../models/menu-model";
import { SliderModel } from "../../models/slider-model";
import {
  unFollowUserSetting,
  unFollowAdminSetting,
  followSetting,
} from "../../models/vac-card-model";

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
  sliderSetting: SliderModel;
  menu: MenuModel;
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
      } else {
        this.unsubscribeStore = store.subscribe(() => {
          this.setState({
            followUp: store.getState().vacation.followUp,
            unFollowUp: store.getState().vacation.unFollowUp,
          });
        });
      }

      this.handleStyle(admin);
    } catch (err) {
      this.handleError(err)
    }
  };

  public componentWillUnmount(): void {
    this.unsubscribeStore();
  }

  // invoke socket, verify path, set tokens
  public handleAuth = async (user, admin) => {
    LoginServices.verifyPath(admin, user, this.props.history);
    invokeConnection(); 
    await AuthServices.getAccessToken()
  };
  // end of function

  public handleRequest = async () => {
    // send request
    const response = await VacationService.getUserVacationAsync();
    this.handleServerSuccess(response)
  };

  public handleServerSuccess = (response) => {
    const action = {
      type: ActionType.getAllVacation,
      payload: response,
    };
    store.dispatch(action);
  };

  public handleError = (err) => {
    console.log(err);
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
                      vacationSettings={followSetting}
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
                    margin={true}
                    vacationSettings={
                      admin ? unFollowAdminSetting : unFollowUserSetting
                    }
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
    setStyle(MenuModel.setMenu(admin), admin ? "admin" : "user");
  };
}

export default Vacations;
