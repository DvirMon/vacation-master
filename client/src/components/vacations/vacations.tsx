import React, { Component } from "react";
import { VacationModel, UserVacationModel } from "../../models/vacations-model";
import { UserModel } from "../../models/user-model";
import { AppTop } from "../app-top/app-top";
import VacCard from "../vac-card/vac-card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { deleteRequest } from "../../services/server";
import { refreshToken } from "../../services/tokens";
import { login, getStorage, logOutService } from "../../services/login";
import "./vacations.scss";
import { TokensModel } from "../../models/tokens.model";

interface VacationsState {
  followUp?: UserVacationModel[];
  unFollowUp?: UserVacationModel[];
  user: UserModel;
  interval: number;
  followIcon: boolean;
  tokens: TokensModel;
}

export class Vacations extends Component<any, VacationsState> {
  constructor(props: any) {
    super(props);

    this.state = {
      followUp: [],
      unFollowUp: [],
      user: null,
      tokens: {
        accessToken: "",
        dbToken: null
      },
      interval: 600000,
      followIcon: false,
    };
  }

  public componentDidMount = async () => {
    try {
      const user = getStorage();

      if (!user) {
        this.props.history.push("/");
      }
      const response = await login(user);
      this.handleResponse(response);

      this.setState({ tokens: response.tokens, user });

      // get new accessToken every 10  min
      setInterval(
        async () => {
          const tokens = { ...this.state.tokens };
          const response = await refreshToken(tokens.dbToken);
          tokens.accessToken = response.accessToken;
          this.setState({ tokens });
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
        const followIcon = this.handelRole(response);
        this.setState({
          followIcon,
          followUp: response.vacations.followUp,
          unFollowUp: response.vacations.unFollowUp
        });
        break;
    }
  };

  public handelRole = response => {
    if (response.user.isAdmin === 1) {
      return false;
    }
    return true;
  };

  render() {
    const {
      followUp,
      unFollowUp,
      user,
      followIcon,
      tokens
    } = this.state;

    return (
      <div className="vacations">
        {followIcon && (
          <nav>
            <AppTop
              admin={false}
              tokens={tokens}
              userInfo={user}
              handleLogOut={this.handleLogOut}
              followUpCounter={followUp.length}
            />
          </nav>
        )}
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
                  accessToken={tokens.accessToken}
                  follow={true}
                  update={this.componentDidMount}
                  followIcon={followIcon}
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
                  accessToken={tokens.accessToken}
                  follow={false}
                  update={this.componentDidMount}
                  followIcon={followIcon}
                  admin={true}
                  handleDelete={this.handleDelete}
                  handleEdit={this.handleEdit}
                ></VacCard>
              </Col>
            ))}
          </Row>
        </main>
      </div>
    );
  }

  public handleLogOut = async () => {
    const tokens = { ...this.state.tokens };
    const history = this.props.history;
    await logOutService (tokens, history);
    
  };

  public handleDelete = () => {
    console.log("delete");
  };

  public handleEdit = () => {
    this.props.history.push("/admin/new-vacation");
    console.log("edit");
  };
}

export default Vacations;
