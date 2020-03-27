import React, { Component } from "react";
import CanvasJSReact from "../../../assets/canvasjs.react";
import "./charts.scss";
import { ChartModel } from "../../../models/charts-model";
import { TokensModel } from "../../../models/tokens.model";
import { getRequest } from "../../../services/serverService";
import { store } from "../../../redux/store/store";

import { Unsubscribe } from "redux";
import Loader from "../../loader/loader";
import { ActionType } from "../../../redux/action-type/action-type";
import { MenuModel, AdminMenu } from "../../../models/menu-model";
import { getAccessToken } from "../../../services/tokensService";

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
      dataPoints: [],
    };
    this.unsubscribeStore = store.subscribe(() => {
      this.setState({ tokens: store.getState().tokens });
    });
  }

  public componentDidMount = async () => {
    // verify admin
    const user = store.getState().user;

    if (!user || user.isAdmin === 0) {
      this.props.history.push("/login");
      console.log("Not Admin");
      return;
    }

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
    const tokens = JSON.parse(sessionStorage.getItem("tokens"));
    if (!tokens) {
      return;
    }
    await getAccessToken(tokens);
    console.log(store.getState().tokens.accessToken)
  }, 600000);
}

export default Charts;
