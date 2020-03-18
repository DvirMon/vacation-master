import React, { Component } from "react";
import clsx from "clsx";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import FavoriteIcon from "@material-ui/icons/Favorite";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { UserVacationModel } from "../../../models/vacations-model";
import "./card-top-icons.scss";
 
interface CardTopIconsProps {
  vacation: UserVacationModel;
  color: boolean;
  followIcon: boolean;
  admin?: boolean;
  handleIconClick?(vacationID: number): void;
  handleDelete?(vacationID?: number): void;
  handleEdit?(vacationID?: number): void;
}

export class CardTopIcons extends Component<CardTopIconsProps, any> {
  constructor(props: CardTopIconsProps) {
    super(props);
  }

  render() {
    const { color, followIcon, admin } = this.props;
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
              <IconButton onClick={this.handleEdit}> 
                  <EditIcon fontSize="large" />
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

  public handleDelete = () => {
    const vacation = this.props.vacation;
    console.log(vacation)
    if (this.props.handleDelete) {
      this.props.handleDelete();
    }
  };

  public handleEdit = () => {
    const vacation = this.props.vacation;
    if (this.props.handleEdit) {
      this.props.handleEdit();
    }
  };
}

export default CardTopIcons;
