import React, { Component } from "react";

import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import FavoriteIcon from "@material-ui/icons/Favorite";

import { UserModel } from "../../../models/user-model";

// import redux
import { store } from "../../../redux/store";
import { Unsubscribe } from "redux";

interface MenuUserProps {
  userInfo?: UserModel;
  followUpCounter?: number;
}

interface MenuUserState {
  followUpCounter?: number;
}

export class MenuUser extends Component<MenuUserProps, MenuUserState> {
  constructor(props, private unsubscribeStore: Unsubscribe) {
    super(props);

    this.state = {
      followUpCounter: store.getState().vacation.followUp.length,
    };
  } 

  public componentDidMount = () => {
    this.unsubscribeStore = store.subscribe(() => {
      this.setState({
        followUpCounter: store.getState().vacation.followUp.length,
      });
    });
  };

  render() {
    
    const { followUpCounter } = this.state;
    const { userInfo } = this.props;

    return (
      <React.Fragment>
        <Typography variant="h6" className="tim-note">
          {userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : "Guest"}
        </Typography>
        <MenuItem>
          <Typography className="tim-note">{`Welcome Back!`}</Typography>
        </MenuItem>
        <IconButton color="inherit">
          <Badge badgeContent={followUpCounter} color="secondary">
            <FavoriteIcon />
          </Badge>
        </IconButton>

        <IconButton color="inherit">
          <Badge color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton color="inherit">
          <Badge color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
      </React.Fragment>
    );
  }
}

export default MenuUser;
