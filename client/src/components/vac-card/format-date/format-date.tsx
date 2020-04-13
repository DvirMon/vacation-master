import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Toolbar from "@material-ui/core/Toolbar";
import FlightTakeoffIcon from "@material-ui/icons/FlightTakeoff";
import FlightLandIcon from "@material-ui/icons/FlightLand";
import Moment from "react-moment";

import "./format-date.scss"
 
interface FormatDateProps {
  departing?: string;
  returning?: string;
  follow?: boolean;
}

export class FormatDate extends Component<FormatDateProps, any> {
  render() {
    const { departing, returning, follow } = this.props;
    return (
      <div className="format-date">
        {follow ? (
          <React.Fragment>
            <Grid container alignItems="flex-end">
              <Toolbar className="p-0 pt-1">
                <FlightTakeoffIcon />
                <MenuItem disableRipple={true}> Departing</MenuItem>
                <FlightLandIcon />
                <MenuItem disableRipple={true}>Returning</MenuItem>
              </Toolbar>
            </Grid>
            <Grid container alignItems="flex-end">
              <Grid item xs={6}>
                <Moment format="DD/MM/YYYY">{departing}</Moment>
              </Grid>
              <Grid item xs={6}>
                <Moment format="DD/MM/YYYY">{returning}</Moment>
              </Grid>
            </Grid>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Grid
              className="follow-container"
              container
              alignItems="flex-end"
            >
              <Toolbar className="follow-header" >
                <FlightTakeoffIcon /> 
                <MenuItem  disableRipple={true}>
                  Departing 
                </MenuItem>
              </Toolbar>
              <Toolbar  className="follow-header" >
                <FlightLandIcon />
                <MenuItem disableRipple={true}>
                  Returning
                </MenuItem>
              </Toolbar>
            </Grid>
            <Grid
              className="follow-container"
              container
              alignItems="flex-end"
            > 
              <Grid className="follow-date" item xs={4}>
                <Moment format="DD/MM/YYYY">{departing}</Moment>
              </Grid >
              <Grid className="follow-date follow-date-return" item xs={4} >
                <Moment format="DD/MM/YYYY">{returning}</Moment>
              </Grid>
            </Grid>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default FormatDate;
