import React, { Component } from "react";

import Loader from "../../loader/loader";
import CanvasJSReact from "../../../assets/canvasjs.react";
import UpdateToken from "../../updateToken/updateToken";

import { ChartModel } from "../../../models/charts-model";

import { HttpService } from "../../../services/server-service";
import { AuthServices } from "../../../services/auth-service";

// import redux
import { store } from "../../../redux/store";
import { ActionType } from "../../../redux/action-type";
import { Unsubscribe } from "redux";

import "./charts.scss";
import { ValidationService } from "../../../services/validation-service";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

interface ChartsState {
  dataPoints: ChartModel[];
  authService : AuthServices
}

export class Charts extends Component<any, ChartsState> {

  private http : HttpService = new HttpService()
  private validationService : ValidationService = new ValidationService()

  private unsubscribeStore: Unsubscribe;

  constructor(props: any) {
    super(props);

    this.state = {
      dataPoints: store.getState().vacation.dataPoints,
      authService : new AuthServices()
    };
  }

  public componentDidMount = async () => {
    await this.state.authService.handleAuth(
      () => this.validationService.verifyAdmin(this.props.history),
      this.props.history
    );

    this.unsubscribeStore = store.subscribe(() => {
      this.setState({
        dataPoints: store.getState().vacation.dataPoints,
      });
    });

    try {
      // handle request
      const url = `http://localhost:3000/api/followup`;
      const response = await this.http.getRequestAsync(url);
      this.handleSuccess(response);
    } catch (err) {
      this.handleError(err);
    }
  };

  public componentWillUnmount(): void {
    if( this.unsubscribeStore) {
      this.unsubscribeStore();
    }
  }

  public handleSuccess = (dataPoints) => {
    store.dispatch({ type: ActionType.updateChartPoints, payload: dataPoints });
  };

  public handleError = (err) => {
    console.log(err);
    this.props.history.push("/admin");
  };

  render() {
    const { dataPoints } = this.state;

    const options = {
      title: {
        text: "Followed Vacations",
      },
      axisY: {
        title: "Users",
        includeZero: false,
      },

      axisX: {
        title: "VacationID",
      },
      data: [
        {
          type: "column",
          dataPoints: dataPoints,
        },
      ],
    };

    return (
      <React.Fragment>
        {dataPoints.length === 0 ? (
          <Loader />
        ) : (
          <div className="charts">
            <div className="container">
              <CanvasJSChart options={options} />
            </div>
          </div>
        )}
        <UpdateToken />
      </React.Fragment>
    );
  }
}

export default Charts;
