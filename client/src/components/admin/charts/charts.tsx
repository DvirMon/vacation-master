import React, { Component } from "react";

import Loader from "../../loader/loader";
import CanvasJSReact from "../../../assets/canvasjs.react";

import { ChartModel } from "../../../models/charts-model";
import { TokensModel } from "../../../models/tokens.model";

import { ServerServices } from "../../../services/serverService";
import { TokensServices } from "../../../services/tokensService";
import { ValidationService } from "../../../services/validationService";

import { store } from "../../../redux/store";
import { Unsubscribe } from "redux";

import "./charts.scss";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

interface ChartsState {
  tokens: TokensModel;
  dataPoints: ChartModel[];
}

export class Charts extends Component<any, ChartsState> {
  private unsubscribeStore: Unsubscribe;

  constructor(props: any) {
    super(props);

    this.state = {
      tokens: store.getState().auth.tokens,
      dataPoints: [],
    };
  }

  public componentDidMount = async () => {
    // subscribe to store
    this.unsubscribeStore = store.subscribe(() => {
      this.setState({
        tokens: store.getState().auth.tokens,
      });
    });

    // verify admin
    ValidationService.verifyAdmin(this.props.history);

    try {
      const url = `http://localhost:3000/api/followup`;
      const tokens = await TokensServices.handleStoreRefresh();
      const response = await ServerServices.getRequest(url, tokens.accessToken);

      console.log(response);

      if (ServerServices.handleServerResponse(response)) {
        alert(response.body);
        this.props.history.push("/admin");
      } else {
        this.setState({ dataPoints: response.body });
      }
    } catch (err) {
      alert(err);
      this.props.history.push("/admin");
    }
  };

  public componentWillUnmount(): void {
    this.unsubscribeStore();
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
