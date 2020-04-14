import { ValidationService } from "./validation-service";

export class FormServices {

  public validInput = (input: string, prop: string, props : any , callback) : void=> {
    let schema = {};

    if (props.scheme) {
      schema = ValidationService.setObjectForSchema(
        props.scheme,
        prop,
        input
      );
    } else {
      schema = ValidationService.setObjectForSchema(schema, prop, input);
    }

    const errorMessage = props.validInput(schema);
    callback(errorMessage)
  }
  
}