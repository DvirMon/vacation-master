import React, { Component } from "react";

import Loader from "../../my-components/loader/loader";
import CanvasJSReact from "../../../assets/canvasjs.react";

import { ChartModel } from "../../../models/charts-model";

import { AuthServices } from "../../../services/auth-service";
import { ValidationService } from "../../../services/validation-service";
import { VacationService } from "../../../services/vacations-service";

// import redux
import { store } from "../../../redux/store";
import { Unsubscribe } from "redux";

import "./charts.scss";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

interface ChartsState {
  dataPoints: ChartModel[];
  authService: AuthServices;
}

export class Charts extends Component<any, ChartsState> {
  private vacationService: VacationService = new VacationService();
  private validationService: ValidationService = new ValidationService();

  private unsubscribeStore: Unsubscribe;

  constructor(props: any) {
    super(props);

    this.state = {
      dataPoints: store.getState().vacation.dataPoints,
      authService: new AuthServices(),
    };
  }

  public componentDidMount = async () => {
    await this.state.authService.handleAuth(
      () => this.validationService.verifyAdmin(),
    );

    this.unsubscribeStore = store.subscribe(() => {
      this.setState({
        dataPoints: store.getState().vacation.dataPoints,
      });
    });

    this.vacationService.getChartInfo();
  };

  public componentWillUnmount(): void {
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
    }
  }

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
      </React.Fragment>
    );
  }
}

export default Charts;
