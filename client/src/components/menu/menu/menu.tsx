import React, { Component } from "react";

import clsx from "clsx";
import { NavLink } from "react-router-dom";

// import materiel ui
import Grid from "@material-ui/core/Grid";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import MenuOutlinedIcon from "@material-ui/icons/MenuOutlined";
import IconButton from "@material-ui/core/IconButton";

import { MenuModel } from "../../../models/menu-model";
import MenuUser from "../menu-user/menu-user";
import MenuAdmin from "../menu-admin/menu-admin";

// import redux
import { store } from "../../../redux/store";
import { Unsubscribe } from "redux/";

import "./menu.scss";

interface MenuProps {
  handleLogOut?(): void;
}

interface MenuState {
  menu: MenuModel;
}

export class Menu extends Component<MenuProps, MenuState> {
  private unsubscribeStore: Unsubscribe;

  constructor(props: MenuProps) {
    super(props);

    this.state = { menu: store.getState().style.menu };
  }

  public componentDidMount = () => {
    this.unsubscribeStore = store.subscribe(() =>
      this.setState({ menu: store.getState().style.menu })
    );
  };

  public componentWillUnmount(): void {
    this.unsubscribeStore();
  }

  render() {
    const { menu } = this.state;
    return (
      <nav
        className={clsx(
          "menu",
          "navbar",
          "navbar-transparent",
          "navbar-color-on-scroll",
          "fixed-top",
          "navbar-expand-lg"
        )}
      >
        {menu.isLoggedIn ? (
          <Grid container className="justify-content-center">
            <Grid item xs={6} className="navbar-translate">
              <h1 className="tim-note">Travel On</h1>
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
                {!menu.admin && (
                  <MenuUser
                    userInfo={menu.user}
                    followUpCounter={menu.followUpCounter}
                  />
                )}
                {menu.admin && <MenuAdmin />}
                {menu.logoutButton && (
                  <MenuItem>
                    <Button
                      className="btn btn-danger text-buttons"
                      variant="contained"
                    >
                      <NavLink to="/logout" exact>
                        Logout
                      </NavLink>
                    </Button>
                  </MenuItem>
                )}
              </MenuList>
            </Grid>
          </Grid>
        ) : (
          menu.register && (
            <Grid container spacing={3}>
              <Grid item xs={12} className="btn-login">
                <Button
                  className="text-buttons"
                  variant="contained"
                  color="primary"
                >
                  <NavLink to="/login" exact>
                    Login
                  </NavLink>
                </Button>
              </Grid>
            </Grid>
          )
        )}
      </nav>
    );
  }
}

export default Menu;
