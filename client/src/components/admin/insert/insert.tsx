import React, { Component } from "react";
import VacCard from "../../vac-card/vac-card";
import MyForm from "../../my-form/my-form";
import { VacationModel } from "../../../models/vacations-model";
import { VacationErrors } from "../../../models/error-model";
import {
  formLegalValues,
  formLegalErrors,
  formLegal
} from "../../../services/validationService";
import { TokensModel } from "../../../models/tokens.model";
import { addVacation } from "../../../services/serverService";
import { store } from "../../../redux/store/store";
import { ActionType } from "../../../redux/action-type/action-type";
import { Grid } from "@material-ui/core";
import { MenuModel, AdminMenu } from "../../../models/menu-model";
import "./insert.scss";
import { getAccessToken } from "../../../services/tokensService";
import { setFormData } from "../../../services/vacationsService";
import { adminStyle } from "../../../services/styleService";

interface InsertState {
  vacation: VacationModel;
  errors: VacationErrors;
  tokens: TokensModel;
  preview: string;
}

export class Insert extends Component<any, InsertState> {
  constructor(props: any) {
    super(props);

    this.state = {
      vacation: new VacationModel(),
      errors: null,
      tokens: store.getState().tokens,
      preview: ""
    };
  }

  public componentDidMount = async () => {
    // verify admin
    const user = store.getState().user;
    if (!user || user.isAdmin === 0) {
      this.props.history.push("/login");
      console.log("Not Admin");
      return;
    }

    // refresh store vacation
    store.dispatch({type: ActionType.refreshVacation,payload: new VacationModel()});

  };

  public componentWillUnmount(): void {
    clearInterval(this.handleTokens);
  }

  public addVacation = async () => {
    const { vacation } = this.state;

    if (formLegal(vacation)) {
      return;
    }

    try {
      const tokens = store.getState().tokens;

      const url = `http://localhost:3000/api/vacations`;

      // create formatDate file
      const myFormData = setFormData(vacation);

      const response = await addVacation(url, myFormData, tokens.accessToken);

      if (response.message === "success") {
        alert("New Vacation has been added!");
        this.props.history.push("/admin");
      } else {
        alert(response.body);
      }
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
  }, 600000);

  render() {
    const { vacation, preview } = this.state;
    return (
      <Grid container className="insert">
        <Grid item xs={8}>
          <MyForm
            vacation={vacation}
            handleChange={this.handleChange}
            handleErrors={this.handleErrors}
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

  public handleErrors = (prop: string, error: string) => {
    const errors = { ...this.state.errors };
    errors[prop] = error;

    if (error.length > 0) {
      this.setState({ errors });
      return;
    }
    this.setState({ errors });
  };
}

export default Insert;
