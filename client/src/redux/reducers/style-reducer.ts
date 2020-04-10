import { StyleAppState } from "../app-state/style-state";
import { Action } from "../action";
import { ActionType } from "../action-type";

export const styleReducer = (oldAppState = new StyleAppState(), action: Action): StyleAppState => {

  const newAppState = { ...oldAppState }

  switch (action.type) {
    case ActionType.updateMenu:
      newAppState.menu = action.payload
      break
    case ActionType.updateBackground:
      newAppState.backgroundImage = action.payload
      break
    case ActionType.updateSliderSetting:
      newAppState.sliderSetting = action.payload
      break
  
  }

  return newAppState
}
