import React, { Component } from "react";

import { v4 as uuidv4 } from "uuid";

// import components
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";

import Badge from "@material-ui/core/Badge";
import NotificationsIcon from "@material-ui/icons/Notifications";
import FavoriteIcon from "@material-ui/icons/Favorite";

// import models
import { NotificationModel } from "../../../models/notification-model";

// import redux
import { store } from "../../../redux/store";
import { ActionType } from "../../../redux/action-type";
import { Unsubscribe } from "redux";

import "./menu-user.scss";

interface MenuUserState {
  followUpCounter?: number;
  notificationCounter?: number;
  notification: NotificationModel[];
  anchorEl: HTMLElement;
}

export class MenuUser extends Component<any, MenuUserState> {
  private unsubscribeStore: Unsubscribe;

  constructor(props: any) {
    super(props);

    this.state = {
      anchorEl: null,
      followUpCounter: store.getState().vacation.followUp.length,
      notification: store.getState().vacation.notification,
      notificationCounter: store.getState().vacation.notification.length,
    };
  }

  public componentDidMount = () => {
    this.unsubscribeStore = this.subscribeToStore();
  };

  public componentWillUnmount = () => {
    this.unsubscribeStore();
  };

  private subscribeToStore = () => {
    return store.subscribe(() => {
      this.setState({
        followUpCounter: store.getState().vacation.followUp.length,
        notification: store.getState().vacation.notification,
        notificationCounter: store.getState().vacation.notification.length,
      });
    });
  };

  render() {
    const {
      followUpCounter,
      anchorEl,
      notification,
      notificationCounter,
    } = this.state;

    return (
      <React.Fragment>
        <IconButton
          color="inherit"
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <Badge color="secondary" badgeContent={notificationCounter}>
            <NotificationsIcon fontSize="large" />
          </Badge>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          {notification.map((update: NotificationModel) => {
            const { text, vacationID } = update;
            return (
              <MenuItem
                key={uuidv4()}
                className="dropdown-item"
                onClick={this.handleLinkClick(vacationID)}
              >
                {text}
              </MenuItem>
            );
          })}
        </Menu>
        <IconButton color="inherit">
          <Badge badgeContent={followUpCounter} color="secondary">
            <FavoriteIcon fontSize="large" />
          </Badge>
        </IconButton>
      </React.Fragment>
    );
  }

  public handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (this.state.notification.length > 0) {
      this.setState({ anchorEl: event.currentTarget });
    }
  };

  public handleLinkClick = (id: number) => (event) => {
    const target = document.getElementById("vacation" + id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  public handleClose = () => {
    this.setState({ anchorEl: null });
    store.dispatch({ type: ActionType.DeleteAllNotification });
  };

}

export default MenuUser;
