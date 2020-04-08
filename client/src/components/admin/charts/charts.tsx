import React, { Component } from "react";

import Loader from "../../loader/loader";
import CanvasJSReact from "../../../assets/canvasjs.react";

import { ChartModel } from "../../../models/charts-model";

import { ServerServices } from "../../../services/serverService";
import { TokensServices } from "../../../services/tokensService";
import { LoginServices } from "../../../services/loginService";

import { store } from "../../../redux/store";
import { Unsubscribe } from "redux";

import "./charts.scss";
import { ActionType } from "../../../redux/action-type";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

interface ChartsState {
  dataPoints: ChartModel[];
}

export class Charts extends Component<any, ChartsState> {
  private unsubscribeStore: Unsubscribe;

  constructor(props: any) {
    super(props);

    this.state = {
      dataPoints: store.getState().vacation.dataPoints,
    };
  }

  public componentDidMount = async () => {

    LoginServices.adminLoginLogic(this.props.history);

    this.unsubscribeStore = store.subscribe(() => {
      this.setState({
        dataPoints: store.getState().vacation.dataPoints,
      });
    });

    try {

      // handle request
      const url = `http://localhost:3000/api/followup`;
      const tokens = await TokensServices.handleStoreRefresh();
      const response = await ServerServices.getRequest(url, tokens.accessToken);
       
      // handle server request
      ServerServices.handleServerResponse(
        response,
        () => this.handleSuccess(response.body),
        () => this.handleError(response.body)
      );

    } catch (err) {
      alert(err);
      this.props.history.push("/admin");
    }
  }; 

  public handleSuccess = (dataPoints) => {
    console.log(dataPoints)
    store.dispatch({ type: ActionType.updateChartPoints, payload: dataPoints });
  };

  public handleError = (err) => {
    alert(err);
    this.props.history.push("/admin");
  };

  public componentWillUnmount(): void {
    clearInterval(this.handleTokens);
  }

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

  public handleTokens = setInterval(async () => {
    await TokensServices.getAccessToken();
    console.log(store.getState().auth.tokens.accessToken);
  }, 360000);
}

export default Charts;
