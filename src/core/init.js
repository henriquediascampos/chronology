import { initRoutes } from "../Routes";
import '../styles/styles.css';
import { initTheme } from "../styles/theme";
import { appendChild } from "./component-factory";

export function init(app) {
  window.addEventListener('load', () => {
    initRoutes();
    initTheme();
  })
  
  const root = document.querySelector("#root");
  appendChild(root, app)
}
