import React, { Component } from "react";

import "./vacations.scss";
import { VacationModel } from "../../models/vacations-model";
import { AppTop } from "../app-top/app-top";
import { UserModel } from "../../models/user-model";
import { deleteRequest, getRequest } from "../../services/server";
import VacCard from "../vac-card/vac-card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { refreshTokens } from "../../services/tokens";
import { login, getVacations } from "../../services/login";

interface VacationsState {
  followUp?: VacationModel[];
  unFollowUp?: VacationModel[];
  user: UserModel;
  accessToken: string;
  dbToken: {
    id: number;
    refreshToken: string;
  };
  interval: number;
}

export class Vacations extends Component<any, VacationsState> {
  constructor(props: any) {
    super(props);

    this.state = {
      followUp: [],
      unFollowUp: [],
      user: null,
      accessToken: "",
      dbToken: null,
      interval: 600000
    };
  }

  public componentDidMount = async () => {
    // get data from LocalStorage
    try {

      const response = await login();
      this.handleResponse(response.vacations)

      this.setState({
        accessToken: response.accessToken,
        dbToken: response.dbToken,
        user: response.user
      });


      // get new accessToken every 10  min
      setInterval(
        async () => {
          const dbToken = { ...this.state.dbToken };
          const response = await refreshTokens(dbToken);
          this.setState({ accessToken: response.accessToken });
        },

        this.state.interval
      );
    } catch (err) {
      console.log(err);
    }
  };

  public handleResponse = response => {
    switch (typeof response) {
      case "string":
        this.props.history.push("/login");
        break;
      case "object":
        this.setState({
          followUp: response.followUp,
          unFollowUp: response.unFollowUp
        });
        break;
    }
  };

  render() {
    const { followUp, unFollowUp, user, accessToken } = this.state;

    return (
      <div className="vacations">
        <nav>
          <AppTop
            admin={false}
            userInfo={user}
            handleLogOut={this.handleLogOut}
            followUpCounter={followUp.length}
            />
        </nav>
        <main>
          <Row>
            {followUp.length > 0 && (
              <h1 className="card-title">My Wish List</h1>
              )}
          </Row>
          <Row>
            {followUp.map(vacation => (
              <Col key={vacation.vacationID} sm={4}>
                <VacCard
                  vacation={vacation}
                  accessToken={accessToken}
                  follow={true}
                  update={this.componentDidMount}
                  user={true}
                  ></VacCard>
              </Col>
            ))}
          </Row>
          <Row>
            <h1 className="card-title">Our Vacations</h1>
          </Row>
          <Row>
            {unFollowUp.map(vacation => (
              <Col key={vacation.vacationID} sm={4}>
                <VacCard
                  vacation={vacation}
                  accessToken={accessToken}
                  follow={false}
                  update={this.componentDidMount}
                  user={true} 
                ></VacCard>
              </Col>
            ))}
          </Row>
        </main>
      </div>
    );
  }

  public handleLogOut = async () => {
    const dbToken = { ...this.state.dbToken };

    // clear refreshToken from db
    const url = `http://localhost:3000/api/tokens/${dbToken.id}`;
    await deleteRequest(url);

    // clear localStorage
    localStorage.clear();

    // redirect to login page
    this.props.history.push("/login");
  };
}

export default Vacations;
