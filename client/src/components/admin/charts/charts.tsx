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

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

interface ChartsState {
  tokens: TokensModel;
  dataPoints: ChartModel[];
  menu: MenuModel;
}

export class Charts extends Component<any, ChartsState> {
  private unsubscribeStore: Unsubscribe;
  constructor(props: any) {
    super(props);

    this.state = {
      tokens: store.getState().tokens,
      dataPoints: [],
      menu: AdminMenu
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

    store.dispatch({ type: ActionType.updateMenu, payload: this.state.menu });
    store.dispatch({ type: ActionType.updateBackground, payload: "" });

    try {
      const tokens = store.getState().tokens;
      const dataPoints = await this.getChartsData(tokens.accessToken);
      this.setState({ dataPoints });
    } catch (err) {
      alert(err);
    }
  };

  public componentWillUnmount(): void {
    this.unsubscribeStore();
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
}

export default Charts;
