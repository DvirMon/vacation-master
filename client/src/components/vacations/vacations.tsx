import React, { Component, lazy, Suspense } from "react";

// import components
import VacCard from "../vac-card/vac-card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Loader from "../loader/loader";
import UpdateToken from "../updateToken/updateToken";
import Slider from "react-slick";

// import services
import { ServerServices } from "../../services/serverService";
import { VacationService } from "../../services/vacationsService";
import { LoginServices } from "../../services/loginService";
import { TokensServices } from "../../services/tokensService";
import { handleUserRealTimeUpdate } from "../../services/socketService";

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

import io from "socket.io-client";

import "./vacations.scss";
import { handelBackground, setStyle } from "../../services/styleServices";
import { Collapse, CardContent, Typography } from "@material-ui/core";

const myCard = lazy(() => import("../vac-card/vac-card"));

interface VacationsState {
  user: UserModel;
  admin: boolean;
  tokens: TokensModel;
  unFollowUp: UserVacationModel[];
  followUp: UserVacationModel[];
  menu: MenuModel;
  sliderSetting: SliderModel;
  expanded: boolean;
  collapseVacation: UserVacationModel;
}

export class Vacations extends Component<any, VacationsState> {
  // unsubscribe to store
  private unsubscribeStore: Unsubscribe;

  // invoke socket object
  public socket = io.connect("http://localhost:3000");

  constructor(props: any) {
    super(props);

    this.state = {
      user: store.getState().auth.user,
      admin: store.getState().auth.admin,
      tokens: store.getState().auth.tokens,
      followUp: store.getState().vacation.followUp,
      unFollowUp: store.getState().vacation.unFollowUp,
      menu: AdminMenu,
      sliderSetting: store.getState().vacation.sliderSetting,
      expanded: false,
      collapseVacation: {},
    };

    if (this.state.admin === false) {
      handleUserRealTimeUpdate(this.socket);
    }
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
          sliderSetting: store.getState().vacation.sliderSetting,
        });
      });

      // verify login
      if (store.getState().auth.isLoggedIn === false) {
        this.props.history.push("/");
        return;
      }

      // get data from store
      const user = store.getState().auth.user;
      const admin = store.getState().auth.admin;

      // get tokens
      await TokensServices.getTokens(user);
      const tokens = store.getState().auth.tokens;

      // unable for client to navigate to other route
      LoginServices.verifyPath(admin, user, this.props.history);

      // if store vacations is empty
      if (store.getState().vacation.unFollowUp.length === 0) {
        // update socket object in store
        store.dispatch({ type: ActionType.updateSocket, payload: this.socket });

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
      this.handleStyle(admin);
    } catch (err) {
      console.log(err);
    }
  };

  public componentWillUnmount(): void {
    this.unsubscribeStore();
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
    const {
      followUp,
      unFollowUp,
      sliderSetting,
      admin,
      expanded,
      collapseVacation,
    } = this.state;

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
                    <Suspense fallback={<div>Loading...</div>}>
                      <VacCard
                        vacation={vacation}
                        follow={true}
                        followIcon={true}
                        handleCollapse={this.handleCollapse}
                      ></VacCard>
                    </Suspense>
                  </Col>
                ))}
              </Slider>
            </Row>
            <Row>
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Col sm={8}>
                  <CardContent>
                    <Typography paragraph>
                      {collapseVacation.description}
                    </Typography>
                  </CardContent>
                </Col>
                <Col sm={4}></Col>
              </Collapse>
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

  public handleCollapse = (vacation: UserVacationModel) => {
    const expanded = this.state.expanded;
    this.setState({ expanded: !expanded, collapseVacation: vacation });
  };

  public updateSliderSetting = () => {
    SliderModel.updateSliderSetting();
  };

  public handleStyle = (admin) => {
    SliderModel.updateSliderSetting();
    setStyle(MenuModel.setMenu(admin), handelBackground(admin));
  };
}

export default Vacations;
