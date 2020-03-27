import { getRequest, postRequest, deleteRequest, getData } from "./serverService";

export const getVacations = async (accessToken) => {

    console.log(accessToken)

  // get user followed and un followed vacations
  const url = `http://localhost:3000/api/vacations/user`;
  try {
    const response = await getRequest(url, accessToken);
    return response
  } catch (err) {
    return err
  }
}
//end of functions

// get all the users following a vacation
export const getFollowersByVacation = async (vacationID) => {
  const url = `http://localhost:3000/api/followup/${vacationID}`;
  try {
    const response = await getRequest(url)
    return response
  }
  catch (err) {
    console.log(err)
  }
}
//end of function

// add new followup vacation
export const addFollowUp = async (vacationID, accessToken) => {
  const url = `http://localhost:3000/api/followup`;
  try {
    await postRequest(url, { vacationID }, accessToken);
  } catch (err) {
    console.log(err);
  }
};
//end of function

// delete followup vacation
export const deleteFollowUp = async (id, accessToken) => {
  const url = `http://localhost:3000/api/followup/${id}`;
  try {
    await deleteRequest(url, accessToken);
  } catch (err) {
    console.log(err);
  }
};
//end of function

// set FormData object for post and put request
export const setFormData = (vacation) => {
  const myFormData = new FormData();
  myFormData.append("description", vacation.description);
  myFormData.append("destination", vacation.destination);
  myFormData.append("startDate", vacation.startDate);
  myFormData.append("endDate", vacation.endDate);
  myFormData.append("price", vacation.price.toString());

  if (typeof vacation.image === "string") {
    myFormData.append("image", vacation.image);
  } else {
    myFormData.append("image", vacation.image, vacation.image.name);
  }
  return myFormData
}
// end of function

// function to update vacation
export const updateVacation = async (url: string, vacation?: FormData, accessToken?: string) => {
  const options = {
    method: "PUT",
    headers: {
      "Authorization": accessToken
    },
    body: vacation
  };
  
  try {
    const response = await getData(url, options);
    return response
  } catch (err) {
    return err
  }
}
// end of function

// function for add new vacation
export const addVacation = async (url: string, vacation?: FormData, accessToken?: string) => {
  const options = {
    method: "POST",
    headers: {
      "Authorization": accessToken
    },
    body: vacation
  };

  try {
    const response = await getData(url, options);
    return response
  } catch (err) {
    return err
  }
}
// end of function



