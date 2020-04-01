import { AppState } from "../app-state/app-state";
import { ActionType } from "../action-type/action-type";

export const userVacationReducer = (oldAppState: AppState, action: ActionType): AppState => {

  const newAppState = { ...oldAppState }

  switch (action) {
  }
  return newAppState
}
