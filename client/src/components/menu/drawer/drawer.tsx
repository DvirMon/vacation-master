import React, { Component } from "react";

import { ListNavItem } from "../../../models/list-nav-item-model";

import Badge from "@material-ui/core/Badge";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from "@material-ui/icons/Home";
import AddIcon from "@material-ui/icons/Add";
import BarChartIcon from "@material-ui/icons/BarChart";
import NotificationsIcon from "@material-ui/icons/Notifications";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import StarBorder from "@material-ui/icons/StarBorder";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

import history from "../../../history";

import { store } from "../../../redux/store";
import { Unsubscribe } from "redux";

import { v4 as uuidv4 } from "uuid";

import { NotificationModel } from "../../../models/notification-model";
import "./drawer.scss";

interface AppDrawerProps {
  admin: boolean;
  drawerOpen: boolean;
  handleDrawerToggle: any;
}

interface AppDrawerState {
  open: boolean;
  drawerOpen: boolean;
  followUpCounter?: number;
  notificationCounter?: number;
  notification: NotificationModel[];
  itemsList: ListNavItem[];
  userItemsList: ListNavItem[];
  adminItemsList: ListNavItem[];
}

export class AppDrawer extends Component<AppDrawerProps, AppDrawerState> {
  private unsubscribeStore: Unsubscribe;
  private logout: ListNavItem = new ListNavItem(
    "Logout",
    <ExitToAppIcon />,
    false,
    () => this.handleLogout()
  );

  constructor(props: AppDrawerProps) {
    super(props);

    this.state = {
      open: false,
      drawerOpen: false,
      followUpCounter: store.getState().vacation.followUp.length,
      notification: store.getState().vacation.notification,
      notificationCounter: store.getState().vacation.notification.length,
      itemsList: [],
      adminItemsList: [
        {
          text: "Home",
          icon: <HomeIcon />,
          onClick: () => history.push("/admin"),
        },
        {
          text: "Add Vacation",
          icon: <AddIcon />,
          onClick: () => history.push("/admin/vacation/new"),
        },
        {
          text: "Charts",
          icon: <BarChartIcon />,
          onClick: () => history.push("/admin/charts"),
        },
        this.logout,
      ],
      userItemsList: [
        {
          text: "Favorites",
          icon: <FavoriteIcon />,
        },
        {
          text: "Notification",
          icon: <NotificationsIcon />,
          nested: true,
          onClick: () => this.handleClick(),
        },
        this.logout,
      ],
    };
  }

  public componentDidMount = () => {
    this.unsubscribeStore = this.subscribeToStore();

    const admin = this.props.admin;
    const { userItemsList, adminItemsList } = this.state;
    admin
      ? this.setState({ itemsList: adminItemsList })
      : this.setState({ itemsList: userItemsList });
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
    const { drawerOpen } = this.props;
    const {
      itemsList,
      open,
      followUpCounter,
      notification,
      notificationCounter,
    } = this.state;

    return (
      <Drawer variant="persistent" open={drawerOpen}>
        <div className="drawer-header">
          <IconButton onClick={this.handleDrawerToggle}>
            {!drawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          {itemsList.map((item: ListNavItem) => {
            const { text, icon, onClick, nested } = item;
            return (
              <React.Fragment key={uuidv4()}>
                <ListItem button key={uuidv4()} onClick={onClick}>
                  {icon && text !== "Favorites" && text !== "Notification" && (
                    <ListItemIcon>{icon}</ListItemIcon>
                  )}
                  {text === "Favorites" && (
                    <ListItemIcon>
                      <Badge badgeContent={followUpCounter} color="secondary">
                        {icon}
                      </Badge>
                    </ListItemIcon>
                  )}
                  {text === "Notification" && (
                    <ListItemIcon>
                      <Badge
                        badgeContent={notificationCounter}
                        color="secondary"
                      >
                        {icon}
                      </Badge>
                    </ListItemIcon>
                  )}
                  <ListItemText primary={text} />
                  {nested && (
                    <React.Fragment>
                      {open ? <ExpandLess /> : <ExpandMore />}
                    </React.Fragment>
                  )}
                </ListItem>
                {nested && (
                  <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {notification.map((update: NotificationModel) => {
                        const { text } = update;
                        return (
                          <ListItem key={uuidv4()} button>
                            <ListItemIcon>
                              <StarBorder />
                            </ListItemIcon>
                            <ListItemText primary={text} />
                          </ListItem>
                        );
                      })}
                    </List>
                  </Collapse>
                )}
              </React.Fragment>
            );
          })}
        </List>
      </Drawer>
    );
  }

  public handleDrawerToggle = (): void => {
    if (this.props.handleDrawerToggle) {
      this.props.handleDrawerToggle();
    }
  };

  public handleClick = (): void => {
    const open = this.state.open;
    this.setState({ open: !open });
  };

  public handleLogout = (): void => {
    this.handleDrawerToggle();
    history.push("/logout");
  };
}

export default AppDrawer;
