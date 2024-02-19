import Template from "./App.html";
import { Button } from "./components/app-button/Button";
import { Componet } from "./core/Component";
import { createElement } from "./core/component-factory";


export default class App extends Componet {
  
  patos = () => 'arroz'

  constructor() {
    const template = createElement(Template);
    super(
      template, 
      [
        {
          ref: 'app-button',
          type: Button
        }
      ],
      true)
  }
    
  ovosmexidos() {
    console.log('teste de visibilidade do js');
  }


}

