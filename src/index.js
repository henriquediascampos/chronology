import './styles/styles.css'
import App from "./App.js";
import { appendChild, render } from "./utils/component-factory.js";

const root = document.querySelector("#root");
const app = new App()

appendChild(root, app.render())

