import React, { Component } from "react";

import Carousel from "react-bootstrap/Carousel";
import VacCard from "../../vac-card/vac-card/vac-card";

import { UserVacationModel } from "../../../models/vacations-model";
import { VacationCardModel } from "../../../models/vac-card-model";

import "./carousel.scss";

interface AppCarouselProps {
  followUp: UserVacationModel[];
  followSetting: VacationCardModel;
}

export class AppCarousel extends Component<AppCarouselProps, any> {
  render() {
    const { followUp, followSetting } = this.props;

    return (
      <Carousel controls={false} interval={null} touch={true} slide={true}>
        {followUp.map((vacation: UserVacationModel) => {
          return (
            <Carousel.Item key={vacation.vacationID}>
              <VacCard
                vacation={vacation}
                vacationSettings={followSetting}
              ></VacCard>
            </Carousel.Item>
          );
        })}
      </Carousel>
    );
  }
}

export default AppCarousel;
