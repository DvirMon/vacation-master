import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { MenuItem } from "@material-ui/core";
import { TokensModel } from "../../models/tokens.model";

interface AppAdminProps {
  tokens?: TokensModel
}

export class AppAdmin extends Component <AppAdminProps , any>{
 
  constructor(props : AppAdminProps) {
    super(props)
  }

  render() {

    const { tokens } = this.props;

    return (
      <div>
        <MenuItem>
          <NavLink
            to={{
              pathname: "/admin/new-vacation",
              state: { detail: tokens }
            }}
          >
            Add Vacation
          </NavLink>
        </MenuItem>
        <MenuItem>
          <NavLink to="/admin">Home</NavLink>
        </MenuItem>
      </div>
    );
  }
}

export default AppAdmin;
