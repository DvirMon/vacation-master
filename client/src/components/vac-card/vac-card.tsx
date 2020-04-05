import React, { Component } from "react";

import clsx from "clsx";
import Moment from "react-moment";

// import material-ui
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import FavoriteIcon from "@material-ui/icons/Favorite";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import CardTopIcons from "./card-top-icons/card-top-icons";

import { UserVacationModel } from "../../models/vacations-model";

import { VacationService } from "../../services/vacationsService";

// import redux
import { store } from "../../redux/store";
import { ActionType } from "../../redux/action-type";

import "./vac-card.scss";

interface VacCardProps {
  vacation?: UserVacationModel;
  followIcon: boolean;
  admin?: boolean;
  hover?: boolean;
  follow?: boolean;
  preview?: string;
  update?(): void;
}

interface VacCardState {
  expanded: boolean;
  setExpanded: boolean;
  clickEvent: boolean;
  color: boolean;
  followers: number;
}

export class VacCard extends Component<VacCardProps, VacCardState> {
  constructor(props: VacCardProps) {
    super(props);

    this.state = {
      expanded: false,
      setExpanded: false,
      clickEvent: false,
      color: false,
      followers: 0,
    };
  }

  public componentDidMount = async () => {
    const vacationID = this.props.vacation.vacationID;
    if (vacationID) {
      const vacation = await VacationService.getFollowersByVacationAsync(
        vacationID
      );
      this.setState({ followers: vacation.followers });

      if (this.props.follow) {
        this.setState({
          color: true,
          clickEvent: true,
        });
      }
    }
  };

  public handleFollowUp = async () => {
    try {
      // get accessToken
      const accessToken = store.getState().auth.tokens.accessToken;
      const vacation = this.props.vacation;
      let clickEvent = this.state.clickEvent;
 
      if (vacation.followUpID) {
        clickEvent = true;
      }

      switch (clickEvent) {
        case true: {
          try {
            await VacationService.deleteFollowUpAsync(
              vacation.followUpID,
              accessToken
            );
            const action = {
              type: ActionType.deleteFollowUp,
              payload: vacation,
            };
            store.dispatch(action);
            this.props.update();
          } catch (err) {
            console.log(err);
          }
          break;
        }
        case false: {
          try {
            const addedVacation = await VacationService.addFollowUpAsync(
              vacation.vacationID,
              accessToken
            );
            vacation.followUpID = addedVacation.id;
            const action = {
              type: ActionType.addFollowUp,
              payload: vacation,
            };
            store.dispatch(action);
            this.props.update();
          } catch (err) {
            console.log(err);
          }
          break;
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { expanded, color, followers } = this.state;
    const { vacation, followIcon, admin, hover, preview } = this.props;

    return (
      <div className="vac-card">
        <Card
          className={clsx({
            root: true,
            "root-hover": hover,
          })}
        >
          <CardMedia
            className="media"
            image={
              preview
                ? preview
                : `http://localhost:3000/api/vacations/uploads/${vacation.image}.jpg`
            }
            title=""
          ></CardMedia>
          <CardHeader
            className={"card-header"}
            action={
              <CardTopIcons
                vacation={vacation}
                color={color}
                followIcon={followIcon}
                admin={admin}
                handleIconClick={this.handleIconClick}
              />
            }
            title={vacation.destination}
            subheader={this.formatDate(vacation.startDate, vacation.endDate)}
          />
          <CardActions disableSpacing>
            <IconButton aria-label="share">
              {vacation.price}
              <MonetizationOnIcon />
            </IconButton>
            {followers > 0 && (
              <IconButton aria-label="share">
                {followers}
                <FavoriteIcon />
              </IconButton>
            )}
            <IconButton
              onClick={this.handleExpandClick}
              className={clsx({ expand: true, expandOpen: expanded })}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography paragraph>{vacation.description}</Typography>
            </CardContent>
          </Collapse>
        </Card>
      </div>
    );
  }

  public handleIconClick = async () => {
    const clickEvent = this.state.clickEvent;

    console.log(this.state.clickEvent);

    await this.handleFollowUp();
    this.setState({ clickEvent: !clickEvent });
  };

  public handleExpandClick = (event) => {
    const expanded = this.state.expanded;
    this.setState({ expanded: !expanded });
  };

  public formatDate = (start: string, end: string) => {
    return (
      <React.Fragment>
        <div>
          Departing:<Moment format="DD MMMM YYYY">{start}</Moment>
        </div>
        <div>
          Returning: <Moment format="DD MMMM YYYY">{end}</Moment>
        </div>
      </React.Fragment>
    );
  };
}

export default VacCard;
