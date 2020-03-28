import React, { Component } from "react";

// import my components
import VacCard from "../../vac-card/vac-card";
import MyForm from "../../my-form/my-form";

// import material-ui
import Grid from "@material-ui/core/Grid";

// import models
import { VacationModel } from "../../../models/vacations-model";
import { VacationErrors } from "../../../models/error-model";
import { TokensModel } from "../../../models/tokens.model";

// import services
import { formLegal, verifyAdmin } from "../../../services/validationService";
import { getAccessToken } from "../../../services/tokensService";
import { setFormData, addVacation } from "../../../services/vacationsService";

// import redux
import { store } from "../../../redux/store/store";
import { ActionType } from "../../../redux/action-type/action-type";
import { Unsubscribe } from "redux";

import "./insert.scss";
import { handleServerResponse } from "../../../services/serverService";

interface InsertState {
  vacation: VacationModel;
  tokens: TokensModel;
  preview: string;
}

export class Insert extends Component<any, InsertState> {
  private unsubscribeStore: Unsubscribe;

  constructor(props: any) {
    super(props);

    this.state = {
      vacation: new VacationModel(),
      tokens: store.getState().tokens,
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

    // refresh store vacation
    store.dispatch({
      type: ActionType.refreshVacation,
      payload: new VacationModel()
    });
  };

  public componentWillUnmount(): void {
    this.unsubscribeStore();
    clearInterval(this.handleTokens);
  }

  public addVacation = async () => {
    const { vacation } = this.state;

    if (formLegal(vacation, VacationModel.validVacation)) {
      return;
    }

    try {
      const tokens = store.getState().tokens;
      const url = `http://localhost:3000/api/vacations`;

      // create formatDate file
      const myFormData = setFormData(vacation);

      // send a request
      const response = await addVacation(url, myFormData, tokens.accessToken);

      // if true server returned an error
      if (handleServerResponse(response)) {
        alert(response.body);
        return;
      }
      alert("New Vacation has been added!");
      this.props.history.push("/admin");
    } catch (err) {
      console.log(err);
    }
  };

  public handleTokens = setInterval(async () => {
    const tokens = JSON.parse(sessionStorage.getItem("tokens"));
    if (!tokens) {
      return;
    }
    await getAccessToken(tokens);
    console.log(store.getState().tokens.accessToken);
  }, 5000);

  render() {
    const { vacation, preview } = this.state;
    return (
      <Grid container className="insert">
        <Grid item xs={8}>
          <MyForm
            vacation={vacation}
            handleChange={this.handleChange}
            handleVacation={this.addVacation}
            handleImage={this.handleImage}
          />
        </Grid>
        <Grid item xs={4}>
          <VacCard
            vacation={vacation}
            followIcon={false}
            admin={false}
            accessToken={""}
            preview={preview}
          />
        </Grid>
      </Grid>
    );
  }

  public handleImage = (preview: string) => {
    this.setState({ preview });
  };

  public handleChange = (prop: string, input: any): void => {
    const vacation = { ...this.state.vacation };
    vacation[prop] = input;
    this.setState({ vacation });
  };
}

export default Insert;
