import React, { Component } from "react";

import clsx from "clsx";

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
import FormatDate from "./format-date/format-date";

import { UserVacationModel } from "../../models/vacations-model";
import { VacationCardModel } from "../../models/vac-card-model";

import { VacationService } from "../../services/vacations-service";

// import redux

import "./vac-card.scss";

interface VacCardProps {
  vacation?: UserVacationModel;
  margin?: boolean;
  preview?: string;
  vacationSettings?: VacationCardModel;
  update?(): void;
}

interface VacCardState {
  expanded: boolean;
  setExpanded: boolean;
  color: boolean;
  followers: number;
  settings: VacationCardModel;
}

export class VacCard extends Component<VacCardProps, VacCardState> {
  constructor(props: VacCardProps) {
    super(props);

    this.state = {
      expanded: false,
      setExpanded: false,
      color: false,
      followers: 0,
      settings: new VacationCardModel(),
    };
  }

  public componentDidMount = async () => {
    this.handleFollowIcon();
    setTimeout(() => this.handleSetting(), 400);

    try {
      // update followup icon number only in user
      if (this.props.vacationSettings.admin === false) {
        const vacation = await VacationService.getFollowersByVacationAsync(
          this.props.vacation.vacationID
        );
        this.setState({ followers: vacation.followers });
      }
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { settings, expanded, color, followers } = this.state;
    const { vacation, preview, margin } = this.props;

    return (
      <div
        className="vac-card"
        id={
          vacation.vacationID ? `vacation${vacation.vacationID.toString()}` : ""
        }
      >
        <Card
          className={clsx({
            root: true,
            "ml-0": margin,
            "mr-0": margin,
            "root-hover": settings.hover,
          })}
        >
          {preview
            ? this.cardMedia(preview, vacation)
            : this.cardMedia(
                `http://localhost:3000/api/vacations/uploads/${vacation.image}.jpg`,
                vacation
              )}
          <CardHeader
            action={
              <CardTopIcons
                vacation={vacation}
                color={color}
                followIcon={settings.followIcon}
                admin={settings.adminIcons}
              />
            }
            title={vacation.destination}
            subheader={
              <FormatDate
                departing={vacation.startDate}
                returning={vacation.endDate}
                follow={settings.follow}
              />
            }
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

  public cardMedia = (imgURL: string, vacation?) => {
    return (
      <CardMedia
        className="media"
        image={imgURL}
        title={`${vacation.destination}`}
      ></CardMedia>
    );
  };

  public handleFollowIcon = () => {
    this.props.vacationSettings.follow === true
      ? this.setState({ color: true })
      : this.setState({ color: false });
  };

  public handleSetting = () => {
    const settings = { ...this.props.vacationSettings };
    this.setState({ settings });
  };

  public handleExpandClick = () => {
    const expanded = this.state.expanded;
    this.setState({ expanded: !expanded });
  };
}

export default VacCard;
