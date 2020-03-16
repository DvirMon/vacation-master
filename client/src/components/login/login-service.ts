export const handleLoginResponse = response => {
  // type string is an error
  switch (typeof response) {
    case "string": {
      return response
    }
    // type object is success 
    case "object": {

      const user = response

      // save response in localStorage for other comp
      localStorage.setItem("user", JSON.stringify(response));

      //admin route
      if (user.isAdmin === 1) {
        return 1;
      }
      // user route
      return 0
    }
  }
};

