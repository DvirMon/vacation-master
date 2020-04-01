
// template of fetch get request
export const getData = async (url: string, options?: {}) => {
  
  try {
    const response = await fetch(url, options)
    const data = await response.json()
    return data
  }
  catch (err) {
    if (err.name === 'AbortError') {
      console.log('Fetch aborted');
      return
    }
    return err
  }
}
// end of function

// template of get request with authorization
export const getRequest = async (url: string, accessToken?: string) => {
  
  const options = {
    headers: {
      "Authorization": accessToken,
    }
  };
  
  try {
    const response = await getData(url, options);
    return response
  } catch (err) {
    return err
  }
  
}
// end of function

// template of post request with authorization
export const postRequest = async (url: string, body?: any, accessToken?: string) => {
  
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": accessToken
    },
    body: JSON.stringify(body)
  };

  try {
    const response = await getData(url, options);
    return response
  } catch (err) {
    return err
  }
}
// end of function


// template for delete request
export const deleteRequest = async (url: string, accessToken?: string) => {
  const options = {
    method: "DELETE",
    headers: {
      "Authorization": accessToken
    }
  };
  try {
    await fetch(url, options);
  } catch (err) {
    return err
  }
}
// end of function

// function to handle server response
export const handleServerResponse = response => {
  if (typeof response === "string" || response.message !== "success") {
    return true 
  // } else if(typeof response === "object" && response.message !== "success") {
  //   return true
  }
  return false;
};
// end of function




