import React, { Component } from "react";
import CanvasJSReact from "../../../assets/canvasjs.react";
import "./charts.scss";
import { ChartModel } from "../../../models/charts-model";
import { TokensModel } from "../../../models/tokens.model";
import { getRequest } from "../../../services/server";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

interface ChartsState {
  tokens: TokensModel;
  dataPoints: ChartModel[];
}

export class Charts extends Component<any, ChartsState> {
  constructor(props: any) {
    super(props);

    this.state = {
      tokens: {
        accessToken: "",
        dbToken: null
      },
      dataPoints: []
    };
  }
 
  public componentDidMount = async () => {
    // get accessToken

    
    const tokens = this.props.location.state.detail;
    const accessToken = tokens.accessToken;

    // get chart data
    const dataPoints = await this.getChartsData(accessToken);

    this.setState({ tokens, dataPoints });

  };

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
