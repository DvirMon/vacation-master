import history from '../history';

export class FormService {

  // set FormData object for post and put request
  public setFormData = (vacation): FormData => {
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

  // handle success 
  public handleSuccess = (successMsg? : string): void => {
    alert(successMsg);
    history.push("/admin");
  };

  // end of function

  public handleError = (err: string): void => {
    alert(err);
  };
}