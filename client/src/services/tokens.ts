import { postRequest, getData } from "./server";

export const getAccessToken = async refreshToken => {

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ refreshToken })
  };
  const url = `http://localhost:3000/api/tokens/new`;

  try {
    const response = await getData(url, options);
    return response
  } catch (err) {
    console.log(err);
  }
};

export const getTokens = async user => {
  const url = `http://localhost:3000/api/tokens`;
  try {
    const response = await postRequest(url, user);
    return response
  } catch (err) {
    console.log(err);
  }
};

export const refreshTokens = async (dbToken) => {
  const response = await getAccessToken(dbToken.refreshToken);
  return response
}