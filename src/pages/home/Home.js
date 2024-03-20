import { Component } from "../../core/Component.js";
import { createElement } from "../../core/component-factory.js";
import Tamplate from "./Home.html";
import styles from './Home.css'

export class Home extends Component {
  
  constructor() {
    const tamplate =  createElement(Tamplate);

    super(tamplate, styles, null, true);

  }
}