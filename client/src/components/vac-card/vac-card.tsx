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
import "./vac-card.scss";
import { VacationModel } from "../../models/vacations-model";
import Moment from "react-moment";
import {
  deleteFollowUp,
  addFollowUp,
  getFollowersByVacation
} from "./vac-card-service";
import DeleteIcon from "@material-ui/icons/Delete";
import CardTopIcons from "./card-top-icons/card-top-icons";

interface VacCardProps {
  vacation: VacationModel;
  accessToken: string;
  follow?: boolean;
  update?(): void;
  user: boolean;
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
    const { vacation, user } = this.props;

    return (
      <div className="vac-card">
        <Card className={`root`}>
          <CardHeader
            className={"card-header"}
            action={
              <CardTopIcons
                vacation={vacation}
                handleIconClick={this.handleIconClick}
                color={color}
                user={user}
              />
            }
            title={vacation.destination}
            subheader={this.formatDate(vacation.startDate, vacation.endDate)}
          />
          <CardMedia
            className="media"
            image={`/assets/img/cards/${vacation.image}.jpg`}
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
    console.log("aaaa");
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
          From:<Moment format="DD MMMM YYYY">{start}</Moment>
        </div>
        <div>
          To: <Moment format="DD MMMM YYYY">{end}</Moment>
        </div>
      </React.Fragment>
    );
  };
}

export default VacCard;
