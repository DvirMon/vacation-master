import React, { Component } from "react";

// import my como
import VacCard from "../../vac-card/vac-card";
import MyForm from "../../my-form/my-form";
import Loader from "../../loader/loader";

// import materiel-ui
import Grid from "@material-ui/core/Grid";

// import models
import { VacationModel } from "../../../models/vacations-model";
import { TokensModel } from "../../../models/tokens.model";

// import services
import { getRequest, handleServerResponse } from "../../../services/serverService";
import { getAccessToken } from "../../../services/tokensService";
import { setFormData, updateVacation } from "../../../services/vacationsService";
import { formLegal, verifyAdmin } from "../../../services/validationService";

// import redux
import { store } from "../../../redux/store/store";
import { ActionType } from "../../../redux/action-type/action-type";
import { Unsubscribe } from "redux";

import "./update.scss";

interface UpdateState {
  vacation: VacationModel;
  tokens: TokensModel;
  updated: boolean;
  preview: string;
}

export class Update extends Component<any, UpdateState> {
  private unsubscribeStore: Unsubscribe;

  constructor(props: any) {
    super(props);

    this.state = {
      vacation: new VacationModel(),
      tokens: store.getState().tokens,
      updated: true,
      preview: ""
    };
  }

  public componentDidMount = async () => {
    // verify admin
    verifyAdmin(this.props.history);

    // subscribe to store
    this.unsubscribeStore = store.subscribe(() => {
      this.setState({
        tokens: store.getState().tokens
      });
    });

    //
    store.dispatch({
      type: ActionType.refreshVacation,
      payload: new VacationModel()
    });

    try {
      const vacationID = this.props.match.params.id;
      const url = `http://localhost:3000/api/vacations/${vacationID}`;
      const vacation = await getRequest(url);
      this.setState({ vacation });

      setTimeout(() => {
        this.setState({ updated: true });
      }, 1100);
    } catch (err) {
      console.log(err);
    }
  };

  public componentWillUnmount(): void {
    this.unsubscribeStore();
    clearInterval(this.handleTokens);
  }

  public handleTokens = setInterval(async () => {
    const tokens = JSON.parse(sessionStorage.getItem("tokens"));
    if (!tokens) {
      return;
    }
    await getAccessToken(tokens);
    console.log(store.getState().tokens.accessToken);
  }, 600000);

  public updateVacation = async () => {
    
    const { vacation, updated } = this.state;
    
    if (updated) {
      const answer = window.confirm(
        "No change has been notice, do you wish to continue?"
      );
      if (!answer) {
        return;
      }
    }

    // validate form
    if (formLegal(vacation, VacationModel.validVacation)) {
      return;
    }

    try {
      const tokens = store.getState().tokens;
      const vacationID = this.props.match.params.id;

      // create formatDate file
      const myFormData = setFormData(vacation);

      const url = `http://localhost:3000/api/vacations/${vacationID}`;

      const response = await updateVacation(
        url,
        myFormData,
        tokens.accessToken
      );

      // if true server returned an error
      if (handleServerResponse(response)) {
        alert(response.body);
        return;
      }
      alert("Vacation has been updated successfully!");
      this.props.history.push("/admin");

      // if (response.message === "success") {
      // } else {
      // }
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { vacation, preview } = this.state;

    return (
      <React.Fragment>
        {!vacation ? (
          <Loader />
        ) : (
          <Grid container className="update">
            <Grid item xs={8}>
              {vacation && (
                <MyForm
                  vacation={vacation}
                  handleChange={this.handleChange}
                  handleVacation={this.updateVacation}
                  handleImage={this.handleImage}
                />
              )}
            </Grid>
            <Grid item xs={4}>
              <VacCard
                vacation={vacation}
                followIcon={false}
                admin={false}
                hover={false}
                accessToken={""}
                preview={preview}
              />
            </Grid>
          </Grid>
        )}
      </React.Fragment>
    );
  }

  public handleImage = (preview: string) => {
    this.setState({ preview });
  };

  public handleChange = (prop: string, input: any) => {
    const vacation = { ...this.state.vacation };
    vacation[prop] = input;
    this.setState({ vacation, updated: false });
  };
}

export default Update;
