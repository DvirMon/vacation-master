import React, { Component } from "react";

import Loader from "../../loader/loader";
import CanvasJSReact from "../../../assets/canvasjs.react";
import UpdateToken from "../../updateToken/updateToken";

import { ChartModel } from "../../../models/charts-model";

import { ServerServices } from "../../../services/server-service";
import { AuthServices } from "../../../services/auth-service"; 

import { store } from "../../../redux/store";
import { ActionType } from "../../../redux/action-type";
import { Unsubscribe } from "redux";

import "./charts.scss";

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
    AuthServices.adminLoginLogic(this.props.history);

    this.unsubscribeStore = store.subscribe(() => {
      this.setState({
        dataPoints: store.getState().vacation.dataPoints,
      });
    });
    
    try {
      // handle request
      const url = `http://localhost:3000/api/followup`;
      const tokens = await AuthServices.handleStoreRefresh();
      const response = await ServerServices.getRequestAsync(url);
      
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
  
  public componentWillUnmount(): void {
    this.unsubscribeStore();
  }
  
  public handleSuccess = (dataPoints) => {
    store.dispatch({ type: ActionType.updateChartPoints, payload: dataPoints });
  };

  public handleError = (err) => {
    alert(err);
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
