import React, { Component } from "react";
import "./my-footer.scss";

export class Footer extends Component {
  render() {
    return (
        <div className="footer copyright float-left">
          &copy;
          {new Date().getFullYear()} made with{" "}
          <i className="material-icons">favorite</i> by
          <a href="https://www.creative-tim.com/" target="blank">
            Creative Tim
          </a>{" "}
          for a better web.
        </div>
    );
  }
} 

export default Footer; 
  