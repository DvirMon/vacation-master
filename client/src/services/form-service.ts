import { VacationModel } from "../models/vacations-model";

export class FormService {

  constructor(
    public url: string, 
    public successMsg: string, 
    public history : any
    ) { }

      // set FormData object for post and put request
  public setFormData = (vacation) => {
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
  public handleSuccess = (vacation: VacationModel) => {

    alert(this.successMsg);
   this.history.push("/admin");

  };
  // end of function

  public handleError = (err: string) => {
    alert(err);
  };
}