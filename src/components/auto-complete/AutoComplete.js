import { Component } from '../../core/Component.js';
// import { Debounce } from '../debounce.js';
import Template from './AutoComplete.html';
import styles from './AutoComplete.css';
import { Input } from '../input/Input.js';
import { Debounce } from '../../utils/debounce.js';

const AutoCompleteProps = {
  OPTIONS: 'options',
  SEARCH: 'search',
  OPTION_LABEL: 'option-label',
  FILTER: 'filter',
};
const InputProps = [
  'label',
  'placeholder',
  'color',
  'bgColor',
  'end-adornment',
];

/**
 * Cria um botão HTML.
 * @param {HTMLInputElement} element - parent.
 * @param {object} context - contexto/class do parent.
 */
export class AutoComplete extends Component {
  /**
   * @type {HTMDivElement}
   */
  #input;

  /**
   * @type {HTMLUListElement}
   */
  #dropdown;

  /**
   * @typedef {object} OptionDef
   * @property {any[]} data
   * @property {any} selected
   */

  /**
   * @type {OptionDef}
   */
  #options = {
    data: [],
    selected: null,
    value: '',
  };

  /**
   * @typedef {Function} SearchFunction
   * @param {string} value - O parâmetro option.
   * @returns {any[]} A string resultante.
   * @type {SearchFunction}
   */
  #search;

  /**
   * @typedef {Function} OptionLabelFunction
   * @param {any} option - O parâmetro option.
   * @returns {string} A string resultante.
   */

  /**
   * @type {OptionLabelFunction}
   */
  #optionLabel;

  /**
   * @typedef {Function} FilterFunction
   * @param {any} option - O parâmetro option.
   * @returns {boolean} A string resultante.
   */

  /**
   * @type {FilterFunction}
   */
  #filter;

  disabledFieldDebounce = new Debounce().handle(
    function (value) {
      const options = this.#search();
      if (!Array.isArray(options)) {
        throw new Error('search não esta retornando um array');
      }
      this.#options.value = value;
      this.#options.data = options;
    }.bind(this),
    400,
  );

  /**
   *
   * @param {Prop} param0
   */
  constructor(props) {
    super({
      templateString: Template,
      styles,
      ...props,
      componentsRef: [
        {
          ref: 'text-field',
          type: Input,
        },
      ],
    });
    this.#input = this.template.querySelector('text-field');
    this.#dropdown = this.template.querySelector('.dropdown');

    const variant = this.source.getAttribute('variant');

    if (!variant) {
      this.template.setAttribute('variant', 'outlined');
    }

    this.setAttributes(
      {
        specificPropsToAssign: InputProps,
      },
      this.#input,
    );

    // this.setAttributes({
    //   specificPropsToAssign: Object.values(AutoCompleteProps),
    // });

    this.handleAttributesAutocomplete();

    this.validate();
  }

  validate() {
    if (!this.#search) {
      throw new Error(
        `A propriedade \`${AutoCompleteProps.SEARCH}\` é obrigatório.`,
      );
    }

    if (!this.#optionLabel) {
      throw new Error(
        `A propriedade \`${AutoCompleteProps.OPTION_LABEL}\` é obrigatório.`,
      );
    }

    if (!this.#filter) {
      throw new Error(
        `A propriedade \`${AutoCompleteProps.FILTER}\` é obrigatório.`,
      );
    }
  }

  handleAttributesAutocomplete() {
    this.#search = this.extractPropContext(AutoCompleteProps.SEARCH);

    this.#optionLabel = this.extractPropContext(
      this.getFunctionName(AutoCompleteProps.OPTION_LABEL),
    );

    this.#filter = this.extractPropContext(
      this.getFunctionName(AutoCompleteProps.FILTER),
    );

    this.#options = new Proxy(this.#options, {
      set: (target, property, value) => {
        target[property] = value; // Atualiza o valor original
        this.dropdown(target, property, value);
        return true;
      },
    });
  }

  /**
   *
   * @param {OptionDef} target
   * @param {'data'| 'selected'} property
   * @param {any[]} value
   */
  dropdown(target, property, value) {
    if (property === 'data') {
      this.#dropdown.innerHTML = '';
      this.#dropdown.classList.add(styles.open);
      if (!target.data.length) {
        const li = document.createElement('li');
        li.textContent = 'Nenhum item encontrado';
        this.#dropdown.appendChild(li);
      }

      target.data
        .filter((option) => this.#filter(option, target.value))
        .forEach((item, index) => {
          const label = this.#optionLabel(item);
          const op = document.createElement('li');
          op.classList.add(this.styles.option);
          op.textContent = label;
          op.addEventListener('mousedown', (e) => {
            this.#options.selected = item;

            this.setValue(label);
          });
          this.#dropdown.appendChild(op);
        });
    }
  }

  setValue(value) {
    const input = this.template.querySelector('input');
    const event = new Event('input', {
      bubbles: true,
      cancelable: true,
    });
    input.value = value;
    input.dispatchEvent(event);
    setTimeout(() => {
      this.#dropdown.classList.remove(styles.open);
    }, 410);
  }
  onfocus(e) {
    this.#dropdown.classList.add(styles.open);
  }

  /**
   *
   * @param {InputEvent} e
   */
  oninput(e) {
    const value = e.currentTarget.value;
    this.disabledFieldDebounce(value);
  }
  onchange(e) {
    // console.log('onchange', e);
  }
  onblur() {
    setTimeout(() => {
      this.#dropdown.classList.remove(styles.open);
    }, 10);
  }
}
