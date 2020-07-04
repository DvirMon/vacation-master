import React, { Component } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Backdrop } from "@material-ui/core";
import "./loader.scss";

export class Loader extends Component {
  render() {
    return (
      <div className="bg-loader page">
        <div className="circular-progress">
        <Backdrop open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
        </div>
      </div>
    );
  }
}

export default Loader;
