import Template from "./App.html";
import { initRoutes } from "./Routes";
import { createElement, render } from "./utils/component-factory";


export default class App {
  
  patos = () => 'arroz'

  constructor() {
    initRoutes();
    this.template = createElement(Template);
  }
    
  ovosmexidos() {
    console.log('teste de visibilidade do js');
  }

  render() {
    return render(this)
  };
}

