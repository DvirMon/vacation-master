import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { MenuItem } from "@material-ui/core";

export class AppAdmin extends Component {
  render() {
    return (
      <div>
        <MenuItem>
          <NavLink to="/admin/new-vacation">Add Vacation</NavLink>
        </MenuItem>
        <MenuItem>
          <NavLink to="/admin">Home</NavLink>
        </MenuItem>
      </div>
    );
  }
}

export default AppAdmin;
