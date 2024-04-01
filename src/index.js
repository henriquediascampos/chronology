import './styles/styles.css';

import App from './App.js';
import { init } from './core/init.js';
import { Theme } from './styles/theme.js';

const theme = Theme.getInstance();

const app = new App();
const renderApp = app.render();
init(renderApp, theme);
