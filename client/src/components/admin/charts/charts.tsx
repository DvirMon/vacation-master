import React, { Component } from "react";
import CanvasJSReact from "../../../assets/canvasjs.react";
import "./charts.scss";
import { ChartModel } from "../../../models/charts-model";
import { TokensModel } from "../../../models/tokens.model";
import { getRequest } from "../../../services/server";
import { store } from "../../../redux/store/store";

import { Unsubscribe } from "redux";

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
      tokens: store.getState().tokens,
      dataPoints: []
    };
    this.unsubscribeStore = store.subscribe(() => {
      this.setState({tokens: store.getState().tokens});
    });
  }

  public componentDidMount = async () => {
    const tokens = this.state.tokens
    const accessToken = tokens.accessToken;

    // get chart data
    const dataPoints = await this.getChartsData(accessToken);

    this.setState({ tokens, dataPoints });
  };

  public componentWillUnmount(): void {
    const controller = new AbortController();
    controller.abort();
    this.unsubscribeStore();
  }

  public getChartsData = async accessToken => {
    const url = `http://localhost:3000/api/followup`;
    const dataPoints = await getRequest(url, accessToken);
    return dataPoints;
  };

  public componentWillMount = () => {
    const controller = new AbortController();
    controller.abort();
  };

  render() {
    const options = {
      title: {
        text: "Followed Vacations"
      },
      axisY: {
        title: "Users"
      },
      axisX: {
        title: "VacationID"
      },
      data: [
        {
          type: "column",
          dataPoints: this.state.dataPoints
        }
      ]
    };

    return (
      <div className="charts container">
        <CanvasJSChart options={options} />
      </div>
    );
  }
}

export default Charts;
