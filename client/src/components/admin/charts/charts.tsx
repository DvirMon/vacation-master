import React, { Component } from "react";
import CanvasJSReact from "../../../assets/canvasjs.react";
import "./charts.scss";
import { ChartModel } from "../../../models/charts-model";
import { TokensModel } from "../../../models/tokens.model";
import { getRequest } from "../../../services/serverService";
import { store } from "../../../redux/store/store";
import AppTop from "../../app-top/app-top/app-top";

import { Unsubscribe } from "redux";
import Loader from "../../loader/loader";
import { getStorage } from "../../../services/loginService";

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
      this.setState({ tokens: store.getState().tokens });
    });
  }

  public componentDidMount = async () => {
    // verify admin
    const user = getStorage("user");
    
    if (!user || user.isAdmin === 0) {
      this.props.history.push("/login");
      console.log("Not Admin");
      return;
    }
    
    try {
      const tokens = getStorage("tokens");
      const accessToken = tokens.accessToken;
      
      const dataPoints = await this.getChartsData(accessToken);
      this.setState({ tokens, dataPoints });
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
    const { dataPoints, tokens } = this.state;

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
          <div className="charts page">
            <nav>
              <AppTop
                user={true}
                admin={true}
                logo={"Travel-on"}
                tokens={tokens}
              ></AppTop>
            </nav>
            <main className="container">
              <CanvasJSChart options={options} />
            </main>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default Charts;
