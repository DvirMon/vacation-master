import React, { Component } from "react";
import clsx from "clsx";
import MenuItem from "@material-ui/core/MenuItem";
import { UserModel } from "../../../models/user-model";
import Button from "@material-ui/core/Button";
import AppUser from "../app-user/app-user";
import AppAdmin from "../app-admin/app-admin";
import MenuOutlinedIcon from "@material-ui/icons/MenuOutlined";
import { IconButton, Grid, MenuList } from "@material-ui/core";
import "./app-top.scss";
import { TokensModel } from "../../../models/tokens.model";

interface AppTopProps {
  reg?: boolean;
  user?: boolean;
  admin?: boolean;
  logoutButton?: boolean;
  userInfo?: UserModel;
  followUpCounter?: number;
  logo?: any;
  tokens? : TokensModel;
  scrolled? : boolean
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
      reg,
      user,
      admin,
      userInfo,
      followUpCounter,
      logo,
      logoutButton,
      scrolled
    } = this.props;
    const { login, logout } = this.state;
    return (
      <nav
        className={clsx(
          "app-top",
          "navbar", 
          "navbar-transparent",
          "navbar-color-on-scroll",
          "fixed-top",
          "navbar-expand-lg",
        )}
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
                {admin && <AppAdmin  
                tokens={this.props.tokens}
                />}
                {logoutButton && (
                  <MenuItem>
                    <Button
                      className="btn btn-danger text-buttons"
                      variant="contained"
                      onClick={this.handleLogOut}
                    >
                      {logout}
                    </Button>
                  </MenuItem>
                )}
              </MenuList>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={3}>
            {reg && (
              <Grid item xs={12} className="btn-login">
                <Button
                  className="text-buttons"
                  variant="contained"
                  color="primary"
                  onClick={this.loginButton}
                >
                  {login}
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
}

export default AppTop;
