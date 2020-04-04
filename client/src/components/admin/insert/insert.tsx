import React, { Component } from "react";

// import my components
import VacCard from "../../vac-card/vac-card";
import MyForm from "../../my-form/my-form";

// import material-ui
import Grid from "@material-ui/core/Grid";

// import models
import { VacationModel } from "../../../models/vacations-model";
import { TokensModel } from "../../../models/tokens.model";

// import services
import { formLegal, verifyAdmin } from "../../../services/validationService";
import { TokensServices } from "../../../services/tokensService";
import { VacationService } from "../../../services/vacationsService";
import { ServerServices } from "../../../services/serverService";

// import redux
import { store } from "../../../redux/store";
import { ActionType } from "../../../redux/action-type";
import { Unsubscribe } from "redux";
 
import "./insert.scss"; 

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
      tokens: store.getState().auth.tokens,
      preview: "aaa"
    };
  }

  public componentDidMount = async () => {

    // subscribe to store
    this.unsubscribeStore = store.subscribe(() => {
      this.setState({
        tokens: store.getState().style.tokens
      });
    });

    // verify admin
    verifyAdmin(this.props.history);
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
      const tokens = store.getState().auth.tokens;
      const url = `http://localhost:3000/api/vacations`;

      // create formatDate file
      const myFormData = VacationService.setFormData(vacation);

      // send a request
      const response = await VacationService.addVacationAsync(
        url,
        myFormData,
        tokens.accessToken
      );

      // if true server returned an error
      if (ServerServices.handleServerResponse(response)) {
        alert(response.body);
        return;
      }

      this.handleSuccess(response.body)

    } catch (err) {
      console.log(err);
    }
  };

  public handleSuccess = (addedVacation) => {
    const action = { type: ActionType.addVacation, payload: addedVacation };
    store.dispatch(action);
    alert("New Vacation has been added!");
    this.props.history.push("/admin");
  };

  public handleTokens = setInterval(async () => {
    const tokens = store.getState().auth.tokens;
    await TokensServices.getAccessToken(tokens);
  }, 360000);

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
