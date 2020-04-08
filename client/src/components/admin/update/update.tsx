import React, { Component, lazy, Suspense } from "react";

// import my como
// import VacCard from "../../vac-card/vac-card";

import MyForm from "../../my-form/my-form";
import Loader from "../../loader/loader";

// import materiel-ui
import Grid from "@material-ui/core/Grid";

// import models
import { VacationModel } from "../../../models/vacations-model";
import { TokensModel } from "../../../models/tokens.model";

// import services
import { ServerServices } from "../../../services/serverService";
import { TokensServices } from "../../../services/tokensService";
import { VacationService } from "../../../services/vacationsService";
import { ValidationService } from "../../../services/validationService";

// import redux
import { store } from "../../../redux/store";
import { ActionType } from "../../../redux/action-type";
import { Unsubscribe } from "redux";

import "./update.scss";
import { handleAdminUpdate } from "../../../services/socketService";

const VacCard = lazy(() => import("../../vac-card/vac-card"));

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
      tokens: store.getState().auth.tokens,
      updated: true,
      preview: "",
    };
  }

  public componentDidMount = async () => {
    // subscribe to store
    this.unsubscribeStore = store.subscribe(() => {
      this.setState({
        tokens: store.getState().auth.tokens,
      });
    });

    // verify admin
    ValidationService.verifyAdmin(this.props.history);

    try {
      const vacationID = this.props.match.params.id;
      const url = `http://localhost:3000/api/vacations/${vacationID}`;
      const vacation = await ServerServices.getRequest(url);
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
    await TokensServices.getAccessToken();
  }, 300000);

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
    if (ValidationService.formLegal(vacation, VacationModel.validVacation)) {
      return;
    }

    try {
      const tokens = store.getState().auth.tokens;
      const vacationID = +this.props.match.params.id;

      // create formatDate file
      const myFormData = VacationService.setFormData(vacation);

      const url = `http://localhost:3000/api/vacations/${vacationID}`;

      const response = await VacationService.updateVacationAsync(
        url,
        myFormData,
        tokens.accessToken
      );

      // if true server returned an error
      if (ServerServices.handleServerResponse(response)) {
        alert(response.body);
        return;
      }

      this.handleSuccess(response.body);

    } catch (err) {
      alert(err);
    }
  };

  public handleSuccess = (vacation) => {

    alert("Vacation has been updated successfully!");
    
    // update store
    store.dispatch({ type: ActionType.updatedVacation, payload: vacation });
    
    // update socket
    handleAdminUpdate(vacation);
    
    // navigate to home page
    this.props.history.push("/admin");
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
            <Suspense fallback={<div>Loading.....</div>}>
              <Grid item xs={4}>
                <VacCard
                  vacation={vacation}
                  followIcon={false}
                  admin={false}
                  hover={false}
                  preview={preview}
                />
              </Grid>
            </Suspense>
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
