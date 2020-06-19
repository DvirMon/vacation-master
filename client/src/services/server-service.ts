import axios from 'axios'

export class HttpService {


  // template of get request with authorization
  public getRequestAsync = async (url: string) => {
    const response = await axios.get(url)
    const data = await response.data
    return data
  }
  // end of function

  // template of post request with authorization
  public postRequestAsync = async (url: string, body: any) => {
    const response = await axios.post(url, body)
    const data = await response.data
    return data
  }
  // end of function

  // template of put request with authorization
  public putRequestAsync = async (url: string, body?: any) => {
    const response = await axios.put(url, body)
    const data = await response.data
    return data
  }
  // end of function

  // template of delete request with authorization
  public deleteRequestAsync = async (url: string) => {
    const response = await axios.delete(url)
    const data = await response.data
    return data
  }
  // end of function
}




