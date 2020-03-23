import { VacationModel } from "../models/vacations-model";
import { getRequest, postRequest, deleteRequest } from "./serverService";
 
export const getVacations = async (accessToken): Promise<VacationModel[]> => {
  const url = `http://localhost:3000/api/vacations/user`;
  try {
    const response = await getRequest(url, accessToken);
    return response
  } catch (err) {
    console.log(err);
  }
}


export const getFollowersByVacation = async (vacationID) => {
  const url = `http://localhost:3000/api/followup/${vacationID}`;
  try {
    const response = await getRequest(url)
    return response
  }
  catch (err) {
    // console.log(err)
  }
}

export const addFollowUp = async (vacationID, accessToken) => {
  const url = `http://localhost:3000/api/followup`;
  try {
    await postRequest(url, { vacationID }, accessToken);
  } catch (err) {
    console.log(err);
  }
};

export const deleteFollowUp = async (id, accessToken) => {
  const url = `http://localhost:3000/api/followup/${id}`;
  try {
    await deleteRequest(url, accessToken);
  } catch (err) {
    console.log(err);
  }
}; 

