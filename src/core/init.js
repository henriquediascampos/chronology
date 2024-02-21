import { appendChild } from "./component-factory";
import { initRoutes } from "../Routes";
import { initTheme } from "../styles/theme";

export function init(app) {
  window.addEventListener('load', () => {
    initRoutes();
    initTheme();
  })
  
  const root = document.querySelector("#root");
  appendChild(root, app)
}
