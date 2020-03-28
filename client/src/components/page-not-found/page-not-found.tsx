import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import  Typography  from "@material-ui/core/Typography";
import  NavLink  from "react-router-dom/NavLink";
import "./page-not-found.scss";

class PageNotFound extends Component {
  public render(): JSX.Element {
    return ( 
      <div className="page-not-found page">
        <Grid container className="pnf-pos">
          <Grid item xs={12} > 
            <Typography className="mrg-bottom" variant={"h4"}>There are many routes but this is not one of them...</Typography>
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
