import { postRequest, deleteRequest, getRequest } from "../../services/server";

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