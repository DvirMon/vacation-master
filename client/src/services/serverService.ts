
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

export const getRequest = async (url: string, accessToken?: string) => {

  const controller = new AbortController();
  const signal = controller.signal;

  const request = new Request(url, { signal });

  const options = {
    headers: {
      "Authorization": accessToken,
    },
    signal: signal
  };
  
  try {
    const response = await getData(url, options);
    return response
  } catch (err) {
    return err
  }

}

export const postRequest = async (url: string, body?: any, accessToken?: string) => {
  
  const controller = new AbortController();
  const signal = controller.signal;
  
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": accessToken
    },
    signal: signal,
    body: JSON.stringify(body)
  };
  
  try {
    const response = await getData(url, options);
    return response
  } catch (err) {
    return err
  }
}

export const putRequest = async (url: string, body?: any, accessToken?: string) => {
  const options = {
    method: "PUT",
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

export const uploadImage = async (url: string, image?: any, accessToken?: string) => {
  const options = {
    method: "POST",
    headers: {
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




