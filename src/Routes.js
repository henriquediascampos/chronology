import { appendChild } from "./core/component-factory.js";

/**
 * @typedef {Array.<Object>} Route
 * @property {string} path - Indicates whether the Courage component is present.
 * @property {Function} navigate - Indicates whether the Power component is present.
 */
export const ROUTES = [
  {
    path: "home",
    navigate: () =>
      import("./pages/home/Home.js").then((module) => new module.Home()),
  },
  {
    path: "login",
    navigate: () =>
      import("./pages/login/Login.js").then((module) => new module.Login()),
  },
];

/**
 *
 * @param {string} path endereço da rota que se deseja navegar
 */
export function navigate(path) {
  window.location.hash = path;
}

/**
 * Inicia o evento de hashchange após carregar a página para verificar a navegação de rotas
 */
export function initRoutes() {
  window.location.hash = window.location.hash || "home";

  window.addEventListener("DOMContentLoaded", () => {
    handleRoute(window.location.hash);

    window.addEventListener("hashchange", () => {
      handleRoute(window.location.hash);
    });
  });
}

/**
 * Lida com a rota em rederizar o modulo no seleto router-outlet
 * @param {string} path
 */
function handleRoute(path) {
  console.log("handle", path);
  const _path = path.startsWith("#") ? path.slice(1) : path;
  const route = ROUTES.filter((r) => r.path === _path)[0];
  if (!route) {
    throw new Error(`Rota [${path}] não encontrada!!!`);
  }
  const routerOutlet = document.querySelector("#router-outlet");
  routerOutlet.innerHTML = "";

  route.navigate().then((module) => {
    appendChild(routerOutlet, module.render());
  });
}
