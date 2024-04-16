import styles from './App.css';
import Template from './App.html';
import { IconButton } from './components/icon-button/IconButton';
import { BasicComponent } from './core/BasicComponent';
import { Router } from './routes/Router';
import { Theme } from './styles/theme';
import { Toolbar } from './components/toolbar/Toolbar'
export default class App extends BasicComponent {
  constructor(prop) {
    const { source, context } = prop || {};
    super({
      templateString: Template,
      styles,
      source,
      context,
      componentsRef: [
        {
          ref: 'route',
          type: Router,
        },
        {
          ref: 'toolbar',
          type: Toolbar,
        },
        {
          ref: 'btn',
          type: IconButton,
        },
      ],
    });
  }

  toogleTheme() {
    Theme.getInstance().toogleTheme();
  }
}
