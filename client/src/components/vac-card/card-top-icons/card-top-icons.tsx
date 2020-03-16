import React, { Component } from "react";
import clsx from "clsx";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import FavoriteIcon from "@material-ui/icons/Favorite";
import DeleteIcon from "@material-ui/icons/Delete";
import { VacationModel } from "../../../models/vacations-model";
import "./card-top-icons.scss";

interface CardTopIconsProps {
  vacation: VacationModel;
  handleIconClick(vacationID: number): void;
  color: boolean;
  user: boolean;
}

export class CardTopIcons extends Component<CardTopIconsProps, any> {
  constructor(props: CardTopIconsProps) {
    super(props);
  }

  render() {
    const { vacation, color, user } = this.props;
    return (
      <div className="top-icons">
        {user ? (
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
          <IconButton onClick={this.handleIconClick}>
            <DeleteIcon fontSize="large" />
          </IconButton>
        )}
      </div>
    );
  }
 
  public handleIconClick = () => {
    const vacation = this.props.vacation;
    this.props.handleIconClick(
      vacation.followUpID ? vacation.followUpID : vacation.vacationID
    );
  };
}

export default CardTopIcons;
