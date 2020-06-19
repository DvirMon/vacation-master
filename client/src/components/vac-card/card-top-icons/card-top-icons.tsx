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
import { HttpService } from "../../../services/http-service";
import { VacationService } from "../../../services/vacations-service";
import { SocketService } from "../../../services/socket-service";


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
  private vacationService: VacationService = new VacationService();
  private socketService : SocketService = new SocketService()


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
    await this.vacationService.handleIconClick(this.props.vacation);

    // update admin chart
    this.socketService.updateChart();
  };

  // function to delete vacation (for admin)
  public handleDelete = async () => {
    const answer = window.confirm("Are You Sure yoe?");
    if (!answer) {
      return;
    }
 
    this.vacationService.deleteVacationAsync(
      this.props.vacation.vacationID.toString(),
      this.props.vacation.image 
    );

    // update real-time
   this.socketService.handleAdminDelete(this.props.vacation);
  };
  // end of function
}

export default CardTopIcons;
