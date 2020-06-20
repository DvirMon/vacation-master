import { HttpService } from "./http-service";
import { SocketService } from "./socket-service";

export class FormService {

  public http: HttpService = new HttpService()
  public socketService: SocketService = new SocketService()


  constructor(
    public url: string,
    public successMsg: string,
    public history: any
  ) { }

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
  public handleSuccess = (): void => {
    alert(this.successMsg);
    this.history.push("/admin");

  };
  // end of function

  public handleError = (err: string): void => {
    alert(err);
  };
}