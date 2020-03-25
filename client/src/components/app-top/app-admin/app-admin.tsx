import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import MenuItem from "@material-ui/core/MenuItem";
import BarChartIcon from "@material-ui/icons/BarChart";
import { TokensModel } from "../../../models/tokens.model";

interface AppAdminProps {
  tokens : TokensModel
}

export class AppAdmin extends Component<AppAdminProps, any> {

  render() {
    return (
      <React.Fragment>
        <MenuItem>
          <BarChartIcon />
          <NavLink
            to={{
              pathname: "/admin/charts", 
              state: { detail: this.props.tokens }

            }}
            exact
          >
            Charts
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
