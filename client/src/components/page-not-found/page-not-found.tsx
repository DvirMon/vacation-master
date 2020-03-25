import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { NavLink } from "react-router-dom";
import "./page-not-found.scss";
import { Typography } from "@material-ui/core";

class PageNotFound extends Component {
  public render(): JSX.Element {
    return ( 
      <div className="page-not-found">
        <Grid container className="pnf-pos">
          <Grid item xs={12}>
            <Typography variant={"h4"}>There are many routes but this is not one of them...</Typography>
            <Typography variant={"h1"}>404</Typography>
            <Button type="button" className="pnf-button tim-note" variant="outlined">
              <NavLink to="/login" exact>
                Back To Home
              </NavLink>
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default PageNotFound;
