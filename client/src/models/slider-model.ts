import { store } from "../redux/store";
import { ActionType } from "../redux/action-type";

export class SliderModel {

  constructor(
    public dots: boolean,
    public infinite: boolean,
    public speed: number,
    public slidesToShow: number,
    public slidesToScroll: number) { }



    static updateSliderSetting = () => {

      const sliderSetting = store.getState().vacation.sliderSetting
      const length = store.getState().vacation.followUp.length;
      if (length > 1) {
        sliderSetting.slidesToShow = 4 ;
        sliderSetting.slidesToScroll = length > 4 ? 4 : length;
        
        store.dispatch({type : ActionType.updateSliderSetting, payload : sliderSetting})
      }
    };
}
 