
export class ListNavItem {

  constructor( 
    public text: string, 
    public icon: JSX.Element,
    public nested? :boolean,
    public onClick?: () => void,
  ) {
  }
}  
