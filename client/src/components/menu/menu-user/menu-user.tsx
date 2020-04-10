import React, { Component } from "react";

import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import NotificationsIcon from "@material-ui/icons/Notifications";
import FavoriteIcon from "@material-ui/icons/Favorite";

import { UserModel } from "../../../models/user-model";
import { Notification } from "../../../models/vacations-model";

// import redux
import { store } from "../../../redux/store";
import { Unsubscribe } from "redux";

import Menu from "@material-ui/core/Menu";

import "./menu-user.scss";
import { Link, animateScroll as scroll } from "react-scroll";

interface MenuUserProps {
  userInfo?: UserModel;
  followUpCounter?: number;
}

interface MenuUserState {
  followUpCounter?: number;
  notificationCounter?: number;
  notification: Notification[];
  anchorEl: HTMLElement;
}

export class MenuUser extends Component<MenuUserProps, MenuUserState> {
  private unsubscribeStore: Unsubscribe;

  constructor(props) {
    super(props);

    this.state = {
      followUpCounter: store.getState().vacation.followUp.length,
      anchorEl: null,
      notification: store.getState().vacation.notification,
      notificationCounter: store.getState().vacation.notification.length,
    };
  }

  public componentDidMount = () => {
    this.unsubscribeStore = store.subscribe(() => {
      this.setState({
        followUpCounter: store.getState().vacation.followUp.length,
        notification: store.getState().vacation.notification,
        notificationCounter: store.getState().vacation.notification.length,
      });
    });
  };

  public componentWillUnmount = () => {
    this.unsubscribeStore();
  };

  render() {
    const { userInfo } = this.props;
    const {
      followUpCounter,
      anchorEl,
      notification,
      notificationCounter,
    } = this.state;

    return (
      <React.Fragment>
        <Typography variant="h6" className="tim-note">
          {userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : "Guest"}
        </Typography>
        <MenuItem>
          <Typography className="tim-note">{`Welcome Back!`}</Typography>
        </MenuItem>
        <IconButton
          color="inherit"
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <Badge color="secondary" badgeContent={notificationCounter}>
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          {notification.map((msg) => (
            <MenuItem
              className="dropdown-item"
              onClick={this.handleLinkClick(msg.vacationID)}
            >
              {msg.msg}
            </MenuItem>
          ))}
        </Menu>
        <IconButton color="inherit">
          <Badge badgeContent={followUpCounter} color="secondary">
            <FavoriteIcon />
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
    const target = document.getElementById("vacation" + id)
    if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
    } 
  };

  public handleClose = () => {
    this.setState({ anchorEl: null, notificationCounter: 0 });
  };
}

export default MenuUser;
