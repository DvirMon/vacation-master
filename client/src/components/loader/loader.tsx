import React, { Component } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./loader.scss";

export class Loader extends Component {
  render() {
    return (
      <div className="loader page">
        <div className="circular-progress">
       
          <CircularProgress size={150} color="inherit" />
        </div>
      </div>
    );
  }
}

export default Loader;
