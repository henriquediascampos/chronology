import { appendChild } from "./component-factory";
import { initRoutes } from "../Routes";

export function init(app) {
  window.addEventListener('load', () => {
    initRoutes();
  })
  
  const root = document.querySelector("#root");
  appendChild(root, app)
}
