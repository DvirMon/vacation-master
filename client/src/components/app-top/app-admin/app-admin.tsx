import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { MenuItem, IconButton, Typography, Toolbar, MenuList } from "@material-ui/core";
import BarChartIcon from "@material-ui/icons/BarChart";

export class AppAdmin extends Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
          <MenuItem>
            <NavLink
              to={{
                pathname: "/admin/charts"
              }}
              exact
            >
              Charts
              <BarChartIcon />
            </NavLink>
          </MenuItem>
          <MenuItem>
            <NavLink
              to={{
                pathname: "/admin/vacation-new"
              }}
            >
              Add Vacation
            </NavLink>
          </MenuItem>
          <MenuItem> 
            <NavLink to="/admin">Home</NavLink>
          </MenuItem>
      </React.Fragment>
    );
  }
}

export default AppAdmin;
