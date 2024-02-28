import Template from "./App.html";
import { Button } from "./components/app-button/Button";
import { Componet } from "./core/Component";
import { createElement } from "./core/component-factory";
import style from './App.css';
import { Toolbar } from "./components/toolbar/Toolbar";

export default class App extends Componet {
  
  patos = () => 'arroz'

  constructor() {
    const template = createElement(Template);
    super(
      template, style,
      [
        {
          ref: 'app-button',
          type: Button
        },
        {
          ref: 'toolbar',
          type: Toolbar
        }       
      ],
      true)
  }
    
  ovosmexidos() {
    console.log('teste de visibilidade do js');
  }


}

