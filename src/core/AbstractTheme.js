export class AbstractTheme {
    /** @type {AbstractTheme} */
    static instance = null;
  
    /**
     * @type {TypeTheme}}
     */
    currentTheme;
  
    /**
     * @type {ConfigTheme}
     */
    configTheme;
  
    /**
     * @typedef {object} Subscriber
     * @property {string} id
     * @property {Function} notify
     *
     * @type {Subscriber}
     */
    subscribers = [];
  
    /**
     *
     * @param {ConfigTheme} config
     */
    constructor(config) {
      if (AbstractTheme.instance) {
        throw new Error('Use Router.getInstance() para obter uma instância.');
      }
  
      if (!config) {
        throw new Error('Informe uma configuração');
      }
  
      if (!config.light || !config.dark) {
        throw new Error('Defina os themas ligth e dark');
      }
  
      this.configTheme = config;
      this.currentTheme = 'light';
    }
  
    /**
     * @param {ColorProp} colorProp
     * @param {string} prefix
     * @param {TypeTheme} type
     *
     */
    setColorProperty(colorProp, prefix, type) {
      for (const prop in colorProp) {
        /** @type {string} */
        const value = colorProp[prop];
        if (!value || !value.startsWith('#') || value.length < 7) {
          throw new Error(
            `A propriedade ${prop} do tipo ${type} esta com o valor de tipo errado: [${value}]. As cores da paletta de cores devem estar no formato haxadecima e conter 7 digitos, 6 numeros e o prefixo "#"`,
          );
        }
        const propName = `--${prefix}-${prop}`;
  
        document.body.style.setProperty(propName, value);
      }
    }
  
    /**
     *
     * @returns {ThemeProp} retorna o tema corrent
     */
    get() {
      return this.configTheme[this.currentTheme];
    }
  
    /**
     *
     * @param {TypeTheme} themeName
     */
    setTheme(themeName) {
      this.currentTheme = themeName;
      const { palette } = this.configTheme[themeName];
      const {
        primary,
        secondary,
        background,
        gray,
        error,
        info,
        success,
        warning,
      } = palette;
      if (!primary || !secondary) {
        throw new Error('Informe as cores primarias e secondarias');
      }
  
      this.setColorProperty(primary, 'primary');
      this.setColorProperty(secondary, 'secondary');
      this.setColorProperty(background, 'backgroud');
      this.setColorProperty(gray, 'gray');
      this.setColorProperty({ error, info, success, warning }, '');
  
      document.body.classList.add(this.currentTheme);
      document.body.classList.remove(
        this.currentTheme !== 'light' ? 'light' : 'dark',
      );
    }
  
    toogleTheme() {
      this.setTheme(this.currentTheme === 'light' ? 'dark' : 'light');
      this.subscribers.forEach(
        function (sub) {
          sub.notify(this.get());
        }.bind(this),
      );
    }
  
    /**
     * Método estático para acessar a instância única da classe.
     * @param {ConfigTheme} config
     * @returns {AbstractTheme}
     */
    static getInstance(config) {
      throw new Error('Implemente o método getInstance');
    }
  
    getPalette() {
      return this.configTheme[this.currentTheme].palette;
    }
  
    /**
     *
     * @param {TypeTheme} type tipo de mudança
     * @param {string} hex cor em hexadecimal
     * @param {number} percent números inteiros de 1 a 100
     * @param {number} opacity números inteiros de 1 a 100
     * @returns
     */
    changeColor(type, hex, percent, opacity) {
      if (hex.indexOf('#') !== 0) {
        throw new Error('O valor da cor deve começar com "#"');
      }
  
      hex = hex.slice(1);
  
      // Converte para valores RGB
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
  
      let newR;
      let newG;
      let newB;
      const darkenAmount = Math.round(255 * (percent / 100));
      if (type === 'light') {
        newR = Math.min(255, r + darkenAmount);
        newG = Math.min(255, g + darkenAmount);
        newB = Math.min(255, b + darkenAmount);
      } else {
        newR = Math.max(0, r - darkenAmount);
        newG = Math.max(0, g - darkenAmount);
        newB = Math.max(0, b - darkenAmount);
      }
  
      const newHex =
        '#' +
        ((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1);
  
      return newHex;
    }
  
    getContrastText(hexColor) {
      const luminance = this.getLuminance(hexColor);
      return luminance > 0.5 ? '#333333' : '#f1f1f1';
    }
  
    getLuminance(hexColor) {
      const r = parseInt(hexColor.substr(1, 2), 16);
      const g = parseInt(hexColor.substr(3, 2), 16);
      const b = parseInt(hexColor.substr(5, 2), 16);
  
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance;
    }
  
    getColor(hex) {
      const main = hex;
      const light = this.changeColor('light', hex, 20);
      const dark = this.changeColor('dark', hex, 20);
      const contrastText = this.getContrastText(hex);
      const luminance = this.getLuminance(hex);
      return {
        main,
        light: luminance ? dark : light,
        dark: luminance ? light : dark,
        contrastText,
      };
    }
  
    subscribe(subscriber) {
      if (subscriber instanceof Function) {
        const id = Math.random().toString(36).substring(2, 9);
        this.subscribers.push({ id, notify: subscriber });
        return id;
      } else {
        throw new Error('Subscriber must be a function');
      }
    }
  
    unsubscribe(id) {
      this.subscribers = this.subscribers.filter((sub) => sub.id !== id);
    }
  }
  