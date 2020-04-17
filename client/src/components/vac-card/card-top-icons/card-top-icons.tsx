import React, { Component } from "react";

// import  utilities
import clsx from "clsx";
import { NavLink } from "react-router-dom";

// import components
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

// import model
import { UserVacationModel } from "../../../models/vacations-model";

// import services
import { ServerServices } from "../../../services/server-service";
import { VacationService } from "../../../services/vacations-service";
import {
  handleAdminDelete,
  updateChart,
} from "../../../services/socket-service";

// import redux
import { store } from "../../../redux/store";
import { ActionType } from "../../../redux/action-type";


interface CardTopIconsProps {
  vacation: UserVacationModel;
  color: boolean;
  followIcon: boolean;
  admin?: boolean;
}

interface CardTopIconsState {
  clickEvent: boolean;
}

export class CardTopIcons extends Component<
  CardTopIconsProps,
  CardTopIconsState
> {
  constructor(props: CardTopIconsProps) {
    super(props);

    this.state = {
      clickEvent: false,
    };
  }

  render() {
    const { color, followIcon, admin, vacation } = this.props;
    return (
      <div>
        {followIcon ? (
          <IconButton
            onClick={this.handleIconClick}
            className={clsx({
              icon: true,
              "showIcon-semi": true,
              "rose-fix": color,
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

  public handleIconClick = async () => {
  
    // handle user click
    const vacation = this.props.vacation;
    await VacationService.handleIconClick(vacation);

    // update admin chart
    updateChart();
  };

  // function to delete vacation (for admin)
  public handleDelete = async () => {
    const answer = window.confirm("Are You Sure yoe?");
    if (!answer) {
      return;
    }

    const vacationID = this.props.vacation.vacationID;
    const fileName = this.props.vacation.image;

    // delete from db
    const url = `http://localhost:3000/api/vacations/${vacationID}/${fileName}`;
    await ServerServices.deleteRequestAsync(url);

    store.dispatch({ type: ActionType.deleteVacation, payload: vacationID })


    // update real-time 
    handleAdminDelete(this.props.vacation);
  };
  // end of function
}

export default CardTopIcons;
