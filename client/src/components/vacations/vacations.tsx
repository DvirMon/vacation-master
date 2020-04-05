import React, { Component, lazy, Suspense } from "react";

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

import Slider from "react-slick";

const myCard = lazy(() => import("../vac-card/vac-card"));

interface VacationsState {
  user: UserModel;
  admin: boolean;
  tokens: TokensModel;
  unFollowUp: UserVacationModel[];
  followUp: UserVacationModel[];
  followUpCarousel: UserVacationModel[];
  menu: MenuModel;
  sliderSetting: {
    dots: boolean;
    infinite: boolean;
    speed: number;
    slidesToShow: number;
    slidesToScroll: number;
    className: string;
  };
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
      followUpCarousel: [],
      menu: AdminMenu,
      sliderSetting: {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        className: "follow-slider",
      },
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
          unFollowUp: store.getState().vacation.unFollowUp,
        });
      });

      // verify login
      if (store.getState().auth.isLoggedIn === false) {
        this.props.history.push("/");
        return;
      }

      const user = store.getState().auth.user;
      const tokens = store.getState().auth.tokens;
      const admin = store.getState().auth.admin;

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
          payload: response.body,
        };
        store.dispatch(action);
      }

      this.handleFollowUpSlider();

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
  }, 30000);

  public handleFollowUpSlider = () => {
    const sliderSetting = { ...this.state.sliderSetting };
    const length = store.getState().vacation.followUp.length;

    if (length > 1) {
      sliderSetting.slidesToShow = length >= 4 ? 4 : length;
      sliderSetting.slidesToScroll = Math.ceil(length / 4);
      this.setState({ sliderSetting });
      console.log(sliderSetting.slidesToShow);
      console.log(sliderSetting.slidesToScroll);
    }
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
                <Col key={vacation.vacationID}>
                  <Suspense fallback={<div>Loading...</div>}>
                    <VacCard
                      vacation={vacation}
                      follow={true}
                      followIcon={true}
                      update={this.handleFollowUpSlider}
                    ></VacCard>
                  </Suspense>
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
                    update={this.handleFollowUpSlider}
                  ></VacCard>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default Vacations;
