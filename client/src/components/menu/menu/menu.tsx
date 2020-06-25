import React, { Component } from "react";

import clsx from "clsx";
import { NavLink } from "react-router-dom";

// import materiel ui
import { AppBar, Typography, Hidden, List, ListItem } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import MenuOutlinedIcon from "@material-ui/icons/MenuOutlined";
import IconButton from "@material-ui/core/IconButton";

import { MenuModel } from "../../../models/menu-model";
import MenuUser from "../menu-user/menu-user";
import MenuAdmin from "../menu-admin/menu-admin";
import AppDrawer from "../drawer/drawer";

// import redux
import { store } from "../../../redux/store";
import { Unsubscribe } from "redux/";

import "./menu.scss";

interface MenuProps {
  handleLogOut?(): void;
}

interface MenuState {
  menu: MenuModel;
  drawerOpen: boolean;
}

export class Menu extends Component<MenuProps, MenuState> {
  private unsubscribeStore: Unsubscribe;

  constructor(props: MenuProps) {
    super(props);

    this.state = {
      menu: store.getState().style.menu,
      drawerOpen: false,
    };
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
    const { menu, drawerOpen } = this.state;

    return (
      <div>
        <AppBar
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
            <div className="toolbar">
              <List className="nav-list" component="nav" aria-label="user info">
                <ListItem>
                  <Typography variant="h2" className="tim-note" noWrap>
                    Travel On
                  </Typography>
                </ListItem>
                <Hidden smDown>
                  <ListItem>
                    <Typography variant="h5" className="tim-note">
                      Hay
                      {menu.user
                        ? ` ${menu.user.firstName} ${menu.user.lastName}!`
                        : " Guest!"}
                    </Typography>
                  </ListItem>
                </Hidden>
              </List>
              <span className="spacer"></span>
              <Hidden smUp>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="end"
                  onClick={this.handleDrawerToggle}
                >
                  <MenuOutlinedIcon fontSize="large" />
                </IconButton>
              </Hidden>
              <span className="spacer"></span>
              <Hidden smDown>
                <MenuList className="navbar-nav ml-auto">
                  {menu.admin ? <MenuAdmin /> : <MenuUser />}

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
              </Hidden>
            </div>
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
        </AppBar> 
        <AppDrawer
          drawerOpen={drawerOpen}
          admin={menu.admin}
          handleDrawerToggle={this.handleDrawerToggle}
        ></AppDrawer>
      </div>
    );
  }

  public handleDrawerToggle = () => {
    const drawerOpen = !this.state.drawerOpen;
    this.setState({ drawerOpen });
  };
}

export default Menu;
