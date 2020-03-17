import React, { Component } from "react";
import { VacationModel } from "../../models/vacations-model";
import { UserModel } from "../../models/user-model";
import { AppTop } from "../app-top/app-top";
import VacCard from "../vac-card/vac-card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { deleteRequest } from "../../services/server";
import { refreshToken } from "../../services/tokens";
import { login, getStorage } from "../../services/login";
import "./vacations.scss";

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
  followIcon: boolean;
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
      interval: 600000,
      followIcon: false
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

      this.setState({
        accessToken: response.accessToken,
        dbToken: response.dbToken,
        user
      });

      // get new accessToken every 10  min
      setInterval(
        async () => {
          const dbToken = { ...this.state.dbToken };
          const response = await refreshToken(dbToken);
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
    const { followUp, unFollowUp, user, accessToken, followIcon } = this.state;

    return (
      <div className="vacations">
        {followIcon && (
          <nav>
            <AppTop
              admin={false}
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
                  accessToken={accessToken}
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
                  accessToken={accessToken}
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

    const dbToken = { ...this.state.dbToken };
    
    // clear refreshToken from db
    const url = `http://localhost:3000/api/tokens/${dbToken.id}`;
    await deleteRequest(url);

    // clear localStorage
    localStorage.clear(); 

    // redirect to login page
    this.props.history.push("/login");
  };

  public handleDelete = () => {
    console.log("delete");
  };

  public handleEdit = () => { 
    this.props.history.push("/admin/new-vacation")
    console.log("edit");
  };
}

export default Vacations;
