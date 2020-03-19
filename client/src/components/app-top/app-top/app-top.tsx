import React, { Component } from "react";
import "./app-top.scss";
import MenuItem from "@material-ui/core/MenuItem";
import { UserModel } from "../../../models/user-model";
import Button from "react-bootstrap/Button";
import FavoriteIcon from "@material-ui/icons/Favorite";
import AppUser from "../app-user/app-user";
import AppAdmin from "../app-admin/app-admin";
import { TokensModel } from "../../../models/tokens.model";
import clsx from "clsx";

interface AppTopProps {
  userInfo?: UserModel;
  followUpCounter?: number;
  handleLogOut?(): void;
  admin: boolean; 
  tokens: TokensModel
}

interface AppTopState {
  user: boolean;
}

export class AppTop extends Component<AppTopProps, AppTopState> {
  constructor(props: AppTopProps) {
    super(props);

    this.state = {
      user: true
    };
  }

  public componentDidMount = () => {  
    const admin = this.props.admin 
    if (admin) {
      this.setState({ user: false });
    }
  };

  render() {

    const { userInfo, followUpCounter, admin, tokens } = this.props;
    const { user } = this.state;
    return ( 
      <nav 
        className={clsx('navbar', 'navbar-transparent', 'navbar-color-on-scroll',  false && 'fixed-top', 'navbar-expand-lg')}
        color-on-scroll="100"
      >
        <div className="container">
          <div className="navbar-translate">
            <h1 className="tim-note">Travel-On</h1>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="navbar-toggler-icon"></span>
              <span className="navbar-toggler-icon"></span>
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ml-auto">
              {user && (
                <AppUser
                  userInfo={userInfo}
                  followUpCounter={followUpCounter}
                />
              )}
              {admin && <AppAdmin 
              tokens={tokens}
              />}
              <MenuItem>
              
                <Button className="btn btn-danger" onClick={this.handleLogOut}>
                  {`Logout`} 
                </Button>
              </MenuItem>
            </ul>
          </div>
        </div>
      </nav>
    );
  }

  public handleLogOut = () => {
    if (this.props.handleLogOut) {
      this.props.handleLogOut();
    }
  };
}

export default AppTop;
