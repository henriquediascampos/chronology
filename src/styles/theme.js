import { AbstractTheme } from '../core/AbstractTheme';

export class Theme extends AbstractTheme {
  constructor(config) {
    super(config);
  }

  static getInstance() {
    if (!Theme.instance) {
      Theme.instance = new Theme({ light, dark });
    }
    return Theme.instance;
  }
}

const light = {
  palette: {
    primary: {
      main: '#f2debe',
      light: '#ffffff', // Branco para destacar elementos no tema claro
      dark: '#d1bfa6', // Tom mais escuro para realce em botões e elementos
      contrastText: '#000000', // Texto contrastante para melhor legibilidade
    },
    secondary: {
      main: '#442b2d', // Complementa a cor principal, adicionando contraste
      dark: '#241717', // Um tom mais escuro para fins de contraste e variedade
      light: '#6e5356', // Um tom mais claro para detalhes sutis
      contrastText: '#ffffff', // Texto contrastante para melhor legibilidade
    },
    background: {
      paper: '#ffffff', // Fundo principal do conteúdo
      background: '#f2f2f2', // Fundo geral da aplicação
    },
    gray: {
      50: '#f9f9f9', // Gradação mais clara de cinza
      100: '#eeeeee',
      200: '#dddddd',
      300: '#cccccc',
      400: '#bbbbbb',
      500: '#aaaaaa', // Cinza principal
      600: '#999999',
      700: '#888888', // Gradação mais escura de cinza
    },
    error: '#ff5252', // Cor de erro
    info: '#2196f3', // Cor de informações
    success: '#4caf50', // Cor de sucesso
    warning: '#ff9800', // Cor de aviso
  },
};

const dark = {
  palette: {
    primary: {
      main: '#d1bfa6',
      light: '#ffffff',
      dark: '#d1bfa6',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#442b2d', // Mesma cor secundária para consistência com o tema light
      dark: '#241717',
      light: '#6e5356',
      contrastText: '#ffffff',
    },
    background: {
      paper: '#1f1f1f', // Fundo principal do conteúdo
      background: '#121212', // Fundo geral da aplicação
    },
    grayscale: {
      50: '#303030', // Gradação mais clara de cinza
      100: '#424242',
      200: '#525252',
      300: '#616161',
      400: '#717171',
      500: '#828282', // Cinza principal
      600: '#929292',
      700: '#a3a3a3', // Gradação mais escura de cinza
    },
    error: '#ff5252',
    info: '#2196f3',
    success: '#4caf50',
    warning: '#ff9800',
  },
};
