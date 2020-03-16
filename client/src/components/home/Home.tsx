import React, { Component } from "react";
import "./home.scss"

export class Home extends Component {
  render() {
    return (
      <div className="home container">
        <div className="row">
          <div className="col-md-8 ml-auto mr-auto">
            <div className="form-group has-default">
              <input
                type="text"
                className="form-control"
                placeholder="Regular"
              />
            </div>
            <div className="brand text-center">
              <h1>Explore The World Of traveling</h1>
              <h3 className="title text-center">Log In</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
