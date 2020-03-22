import React, { Component } from "react";
import clsx from "clsx";
import MenuItem from "@material-ui/core/MenuItem";
import { UserModel } from "../../../models/user-model";
import Button from "react-bootstrap/Button";
import FavoriteIcon from "@material-ui/icons/Favorite";
import AppUser from "../app-user/app-user";
import AppAdmin from "../app-admin/app-admin";
import MenuOutlinedIcon from "@material-ui/icons/MenuOutlined";
import { IconButton, Grid, MenuList } from "@material-ui/core";
import "./app-top.scss";

interface AppTopProps {
  logged?: boolean;
  reg?: boolean;
  user?: boolean;
  admin?: boolean;
  userInfo?: UserModel;
  followUpCounter?: number;
  logo?: any;
  handleLogOut?(): void;
  loginButton?(): void;
  registerButton?(): void;
}

interface AppTopState {
  login: string;
  logout: string;
  register: string;
}

export class AppTop extends Component<AppTopProps, AppTopState> {
  constructor(props: AppTopProps) {
    super(props);

    this.state = {
      login: "Login",
      logout: "Logout",
      register: "Register"
    };
  }

  render() {
    const {
      logged,
      reg,
      user,
      admin,
      userInfo,
      followUpCounter,
      logo
    } = this.props;
    const { login, logout, register } = this.state;
    return (
      <nav
        className={clsx(
          "app-top",
          "navbar",
          "navbar-transparent",
          "navbar-color-on-scroll",
          "fixed-top",
          "navbar-expand-lg"
        )}
        color-on-scroll="100"
      >
        {user ? (
          <Grid container className="justify-content-center">
            <Grid item xs={6} className="navbar-translate">
              <h1 className="tim-note">{logo}</h1>
              <IconButton
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                aria-expanded="false"
              >
                <MenuOutlinedIcon color="inherit" fontSize="large" />
              </IconButton>
            </Grid>
            <Grid item xs={6} className="collapse navbar-collapse">
              <MenuList className="navbar-nav ml-auto">
                {!admin && (
                  <AppUser
                    userInfo={userInfo}
                    followUpCounter={followUpCounter}
                  />
                )} 
                {admin && <AppAdmin />}
                <MenuItem>
                  <Button
                    className="btn btn-danger"
                    onClick={this.handleLogOut}
                  >
                    {logout}
                  </Button>
                </MenuItem>
              </MenuList>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={3}>
            {!reg ? (
              <Grid item xs={12} className="btn-login">
                <Button
                  className="btn btn-primary"
                  onClick={this.loginButton}
                >
                  {login}
                </Button>
              </Grid>
            ) : (
              <Grid item xs={12} className="btn-register">
                <Button
                  className="btn btn-danger"
                  onClick={this.registerButton}
                >
                  {register}
                </Button>
              </Grid>
            )}
          </Grid>
        )}
      </nav>
    );
  }

  public handleLogOut = () => {
    if (this.props.handleLogOut) {
      this.props.handleLogOut();
    }
  };

  public loginButton = () => {
    if (this.props.loginButton) {
      this.props.loginButton();
    }
  };

  public registerButton = () => {
    if (this.props.registerButton) {
      this.props.registerButton();
    }
  };
}

export default AppTop;
