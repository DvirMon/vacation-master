import React, { Component } from "react";

import clsx from "clsx";
import { NavLink } from "react-router-dom";
 
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

import { UserVacationModel } from "../../../models/vacations-model";

import { deleteRequest } from "../../../services/serverService";
 
import { store } from "../../../redux/store";
import { ActionType } from "../../../redux/action-type";

import "./card-top-icons.scss";

interface CardTopIconsProps {
  vacation: UserVacationModel;
  color: boolean;
  followIcon: boolean;
  admin?: boolean;
  handleIconClick?(vacationID: number): void;
}

interface CardTopIconsState {
  clickEvent: boolean,
}

export class CardTopIcons extends Component<CardTopIconsProps, CardTopIconsState> {


  constructor(props : CardTopIconsProps) {
    super(props)
  
    this.state = {
      clickEvent: false,
    }
  }
  

  render() {
    const { color, followIcon, admin, vacation } = this.props;
    return (
      <div className="top-icons">
        {followIcon ? (
          <IconButton
            onClick={this.handleIconClick}
            className={clsx({
              icon: true,
              "showIcon-semi": true,
              "rose-fix": color
            })}
          >
            <FavoriteIcon fontSize="large" />
          </IconButton>
        ) : (
          admin && (
            <React.Fragment>
              <IconButton onClick={this.handleDelete}>
                <DeleteIcon fontSize="large" />
              </IconButton>
              <IconButton>
                <NavLink to={`admin/vacation/${vacation.vacationID}`}>
                  <EditIcon fontSize="large" />
                </NavLink>
              </IconButton>
            </React.Fragment>
          )
        )}
      </div>
    );
  }

  public handleIconClick = () => {

    const vacation = this.props.vacation;
    if (this.props.handleIconClick) {
      this.props.handleIconClick(
        vacation.followUpID ? vacation.followUpID : vacation.vacationID
      );
    }
  };

  public handleDelete = async () => {
    const answer = window.confirm("Are You Sure yoe?");
    if (!answer) {
      return;
    }

    const vacationID = this.props.vacation.vacationID;
    const tokens = store.getState().auth.tokens;
    
    // delete from db
    const url = `http://localhost:3000/api/vacations/${vacationID}`;
    await deleteRequest(url, tokens.accessToken);
    
    // delete from store 
    const action = { type: ActionType.deleteVacation, payload: vacationID };
    store.dispatch(action);
  };
}

export default CardTopIcons;
