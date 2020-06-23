import React, { Component } from "react";

// import components
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import VacCard from "../vac-card/vac-card";
import Loader from "../my-components/loader/loader";
import Slider from "react-slick";
import UpdateToken from "../auth/updateToken/updateToken";

// import services
import { AuthServices } from "../../services/auth-service";
import { VacationService } from "../../services/vacations-service";
import { LoginServices } from "../../services/login-service";
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

  private unsubscribeStore: Unsubscribe;
  private authService: AuthServices = new AuthServices();
  private loginService: LoginServices = new LoginServices();
  private vacationService: VacationService = new VacationService();

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
        this.handleError("Please Login");
        return;
      }

      // subscribe to store
      this.unsubscribeStore = this.subscribeToStore();

      const { user, admin } = this.state;

      // handle auth logic
      await this.authService.handleAuth(
        () => this.loginService.verifyPath(admin, user, this.props.history),
        this.props.history
      );

      // get vacations
      await this.getVacations();

      this.handleStyle(admin);
    } catch (err) {
      this.handleError(err);
    }
  };

  public componentWillUnmount(): void {
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
    }
  }

  private subscribeToStore = () => {
    return store.subscribe(() => {
      this.setState({
        user: store.getState().auth.user,
        admin: store.getState().auth.admin,
        tokens: store.getState().auth.tokens,
        followUp: store.getState().vacation.followUp,
        unFollowUp: store.getState().vacation.unFollowUp,
        sliderSetting: store.getState().style.sliderSetting,
      });
    });
  };

  private getVacations = async () => {
    if (store.getState().vacation.unFollowUp.length === 0) {
      await this.vacationService.getUserVacationAsync();
    } else {
      this.setState({
        followUp: store.getState().vacation.followUp,
        unFollowUp: store.getState().vacation.unFollowUp,
      });
    }
  };

  private handleError = (err) => {
    console.log(err)
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

  private handleStyle = (admin) => {
    setStyle(MenuModel.setMenu(admin), admin ? "admin" : "user");
  };
}

export default Vacations;
