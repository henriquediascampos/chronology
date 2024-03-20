// import '../styles/styles.css';
import { initRoutes } from "../Routes";
import { initTheme } from "../styles/theme";
import { appendChild } from "./component-factory";

export function init(app) {
  initRoutes();
  initTheme();

  
  const root = document.querySelector("#root");
  appendChild(root, app)
}
