import React, { Component } from "react";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { UserModel } from "../../../models/user-model";
// import "./app-user.scss";

interface AppUserProps {
  userInfo?: UserModel;
  followUpCounter?: number;
} 
 
export class AppUser extends Component<AppUserProps, any> {
  render() {

    const { userInfo , followUpCounter} = this.props;
    
    return (
        <React.Fragment>
          <MenuItem>
            <IconButton color="inherit">
              <AccountCircle />
            </IconButton>
          </MenuItem>
          <Typography variant="h6" className="tim-note">
            {userInfo && `${userInfo.firstName} ${userInfo.lastName}`}
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

export default AppUser;
