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
import { handelBackground, setStyle } from "../../services/styleServices";

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
      user: store.getState().auth.user,
      admin: store.getState().auth.admin,
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
      if (store.getState().auth.isLoggedIn === false) {
        console.log(store.getState().auth.isLoggedIn);
        this.props.history.push("/");
        return;
      }

      // subscribe to store
      this.unsubscribeStore = store.subscribe(() => {
        this.setState({
          user: store.getState().auth.user,
          admin: store.getState().auth.admin,
          tokens: store.getState().auth.tokens,
          followUp: store.getState().vacation.followUp,
          unFollowUp: store.getState().vacation.unFollowUp,
          sliderSetting: store.getState().style.sliderSetting,
        });
      });

      const { user, admin } = this.state;
      await this.authLogic(user, admin);
      await this.vacationLogic();
      this.handleStyle(admin);
    } catch (err) {
      console.log(err);
    }
  };

  public authLogic = async (user, admin) => {
    // invoke socket connection
    invokeConnection();

    // get tokens
    await TokensServices.getTokens(user);

    // unable for client to navigate to other route
    LoginServices.verifyPath(admin, user, this.props.history);
  };

  public vacationLogic = async () => {
    if (store.getState().vacation.unFollowUp.length === 0) {
      // update socket object in store
      const tokens = store.getState().auth.tokens;

      // get vacation
      const response = await VacationService.getVacationsAsync(
        tokens.accessToken
      );

      // handle response - if true there is an error
      if (ServerServices.handleServerResponse(response)) {
        this.handleServerError(response);
      } else {
        this.handleServerSuccess(response);
      }
    }
  };

  public componentWillUnmount(): void {
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
    }
  }

  public handleServerError = (response) => {
    alert(response);
    this.props.history.push("/logout");
  };

  public handleServerSuccess = (response) => {
    const action = {
      type: ActionType.getAllVacation,
      payload: response.body,
    };
    store.dispatch(action);
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

  public updateSliderSetting = () => {
    SliderModel.updateSliderSetting();
  };

  public handleStyle = (admin) => {
    SliderModel.updateSliderSetting();
    setStyle(MenuModel.setMenu(admin), handelBackground(admin));
  };
}

export default Vacations;
