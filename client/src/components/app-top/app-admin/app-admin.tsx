import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { MenuItem, IconButton, Typography, Toolbar } from "@material-ui/core";
import { TokensModel } from "../../../models/tokens.model";
import BarChartIcon from "@material-ui/icons/BarChart";

interface AppAdminProps {
  tokens?: TokensModel;
}

export class AppAdmin extends Component<AppAdminProps, any> {
  constructor(props: AppAdminProps) {
    super(props);
  }

  render() {
    const { tokens } = this.props;

    return (
      <div>
        <Toolbar>
          <IconButton color="inherit">
            <NavLink
              to={{
                pathname: "/admin/charts",
                state: { detail: tokens }
              }}
              exact
            >
              <BarChartIcon />
            </NavLink>
          </IconButton>
          <MenuItem>
            <NavLink
              to={{
                pathname: "/admin/vacation-new",
                state: { detail: tokens }
              }}
            >
              Add Vacation
            </NavLink>
          </MenuItem>
          <MenuItem>
            <NavLink to="/admin">Home</NavLink>
          </MenuItem>
        </Toolbar>
      </div>
    );
  }
}

export default AppAdmin;
