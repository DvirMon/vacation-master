import React, { Component } from "react";
import clsx from "clsx";
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
import { UserVacationModel } from "../../models/vacations-model";
import Moment from "react-moment";
import {
  deleteFollowUp,
  addFollowUp,
  getFollowersByVacation
} from "../../services/vacationsService";
import CardTopIcons from "./card-top-icons/card-top-icons";
import "./vac-card.scss";

interface VacCardProps {
  vacation: UserVacationModel;
  accessToken: string;
  follow?: boolean;
  followIcon: boolean;
  admin?: boolean;
  hover? : boolean
  preview?: string;
  update?(): void;
  handleDelete?(vacationID?: number): void;
  handleEdit?(vacationID?: number): void;
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
      followers: 0
    };
  }

  public componentWillMount = () => {
    if (this.props.follow) {
      this.setState({
        color: true,
        clickEvent: true
      });
    }
  };

  public componentDidMount = async () => {
    const vacationID = this.props.vacation.vacationID;
    if (vacationID) {
      const followers = await getFollowersByVacation(vacationID);
      this.setState({ followers: followers.followers });
    }
  };

  public handleFollowUp = async (vacationID: number) => {
    try {
      // get accessToken
      const accessToken = this.props.accessToken;

      const clickEvent = this.state.clickEvent;
      switch (clickEvent) {
        case true: {
          await deleteFollowUp(vacationID, accessToken);
          this.props.update();
          break;
        }
        case false: {
          await addFollowUp(vacationID, accessToken);
          this.props.update();
          break;
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { expanded, color, followers } = this.state;
    const { vacation, followIcon, admin, preview, hover } = this.props;

    return (
      <div className="vac-card">
        <Card
          className={clsx({
            root: true,
            "root-hover": hover
          })}
        >
          <CardHeader
            className={"card-header"}
            action={
              <CardTopIcons
                vacation={vacation}
                handleIconClick={this.handleIconClick}
                color={color}
                followIcon={followIcon}
                admin={admin}
                handleDelete={this.handleDelete}
                handleEdit={this.handleEdit}
              />
            }
            title={vacation.destination}
            subheader={this.formatDate(vacation.startDate, vacation.endDate)}
          />
          <CardMedia
            className="media"
            image={
              preview
                ? preview 
                : `http://localhost:3000/api/vacations/uploads/${vacation.image}.jpg`
            }
            title=""
          ></CardMedia>
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

  public handleIconClick = async (vacationID: number) => {
    const clickEvent = this.state.clickEvent;
    this.setState({ clickEvent: !clickEvent });
    await this.handleFollowUp(vacationID);
  };

  public handleExpandClick = event => {
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

  public handleDelete = (vacationID: number) => {
    if (this.props.handleDelete) {
      this.props.handleDelete(vacationID);
    }
  };

  public handleEdit = (vacationID: number) => {
    if (this.props.handleEdit) {
      this.props.handleEdit(vacationID);
    }
  };
}

export default VacCard;
