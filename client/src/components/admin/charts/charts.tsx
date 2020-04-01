import React, { Component } from "react";

import Loader from "../../loader/loader";
import CanvasJSReact from "../../../assets/canvasjs.react";

import { ChartModel } from "../../../models/charts-model";
import { TokensModel } from "../../../models/tokens.model";

import { getRequest } from "../../../services/serverService";
import { TokensServices } from "../../../services/tokensService";

import { store } from "../../../redux/store/store";
import { Unsubscribe } from "redux";

import "./charts.scss";
import { verifyAdmin } from "../../../services/validationService";

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
  }

  public componentDidMount = async () => {

    // subscribe to store
    this.unsubscribeStore = store.subscribe(() => {
      this.setState({
        tokens: store.getState().tokens
      });
    });

    // verify admin
    verifyAdmin(this.props.history);

    try {
      const tokens = store.getState().tokens;
      const dataPoints = await this.getChartsData(tokens.accessToken);
      this.setState({ dataPoints });
    } catch (err) {
      alert(err);
      this.props.history.push("/admin");
    }
  };

  public componentWillUnmount(): void {
    this.unsubscribeStore();
    clearInterval(this.handleTokens);
  }

  public getChartsData = async accessToken => {
    const url = `http://localhost:3000/api/followup`;
    const dataPoints = await getRequest(url, accessToken);
    return dataPoints;
  };

  render() {
    const { dataPoints } = this.state;

    const options = {
      title: {
        text: "Followed Vacations"
      },
      axisY: {
        title: "Users",
        includeZero: false
      },

      axisX: {
        title: "VacationID"
      },
      data: [
        {
          type: "column",
          dataPoints: dataPoints
        }
      ]
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
    const tokens = store.getState().tokens;
    console.log(tokens);
    console.log("-------");
    await TokensServices.getAccessToken(tokens);
    console.log(store.getState().tokens.accessToken);
  }, 60000);
}

export default Charts;
