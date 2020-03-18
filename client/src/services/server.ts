
export const getData = async (url: string, options?) => {

  try {
    const response = await fetch(url, options)
    const data = await response.json()
    return data
  }
  catch (err) {
    return err
  }
}

export const getRequest = async (url, accessToken?) => {
  const options = {
    headers: {
      "Authorization": accessToken
    }
  };

  try {
    const response = await getData(url, options);
    return response
  } catch (err) {
    return err
  }

}

export const postRequest = async (url, body?, accessToken?) => {
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
export const uploadImage = async (url, image?, accessToken?) => {
  const options = {
    method: "POST",
    headers :{
      "Authorization": accessToken
    },
    body: image
  };

  try {
    const response = await getData(url, options);
    return response
  } catch (err) {
    return err
  }

}

export const deleteRequest = async (url, accessToken?) => {
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




