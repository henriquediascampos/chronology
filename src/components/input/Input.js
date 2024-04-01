import { Component } from '../../core/Component.js';
// import { Debounce } from '../debounce.js';
import Template from './Input.html';
import styles from './Input.css';
import { IconButton } from '../icon-button/IconButton.js';

const InputProps = Object.freeze({
  END_ADORNMENT: 'end-adornment',
  START_ADORNMENT: 'start-adornment',
  END_ADORNMENT_ACTION: 'end-adornment-action',
  START_ADORNMENT_ACTION: 'start-adornment-action',
});

const InputPropsDefault = Object.freeze({
  required: 'required',
  label: 'label',
  variant: 'variant',
  placeholder: 'placeholder',
  //events
  oninput: 'oninput',
  onchange: 'onchange',
  onfocus: 'onfocus',
  onblur: 'onblur',
  onkeydown: 'onkeydown',
  onkeypress: 'onkeypress',
  onkeyup: 'onkeyup',
  onselect: 'onselect',
  oncontextmenu: 'oncontextmenu',
  oncut: 'oncut',
  oncopy: 'oncopy',
  onpaste: 'onpaste',
  onmousedown: 'onmousedown',
  onmouseenter: 'onmouseenter',
  onmouseleave: 'onmouseleave',
  onmousemove: 'onmousemove',
  onmouseout: 'onmouseout',
  onmouseover: 'onmouseover',
  onmouseup: 'onmouseup',
});

/**
 * Cria um botão HTML.
 * @param {HTMLInputElement} element - O icone.
 * @param {object} context - O icone.
 * @throws {Error} - Se os parâmetros handleClick ou label forem omitidos.
 */
export class Input extends Component {
  // #disabledFieldDebounce = new Debounce().handle(
  //   this.disabledField.bind(this),
  //   400,
  // );

  /**
   * @type {HTMLLegendElement}
   */
  #legend;

  /**
   * @type {HTMLInputElement}
   */
  #input;

  /**
   * @type {HTMLLabelElement}
   */
  #label;

  /**
   * @type {HTMDivElement}
   */
  #formField;

  /**
   * @param {Prop} props
   */
  constructor({ source, context }) {
    super({
      templateString: Template,
      styles,
      source,
      context,
      noExternalComponents: true,
    });

    this.#legend = this.template.querySelector('legend');
    this.#input = this.template.querySelector('input');
    this.#label = this.template.querySelector('label');
    this.#formField = this.template;

    const variant = this.source.getAttribute('variant');

    if (!variant) {
      this.template.setAttribute('variant', 'outlined');
    }

    this.inputFormField();

    this.disableForm();
    this.disabledField();

    const label = this.source.getAttribute('label');
    if (!label) {
      throw new Error('o atributo "label é obrigatório"');
    }

    this.#legend.innerText = label;
    this.#label.innerText = this.#input.placeholder = label;

    this.#input.placeholder = this.source.getAttribute('placeholder') || label;

    if (this.template.hasAttribute('required')) {
      this.template.classList.add('required');
    }

    this.setAttributes(
      { specificPropsToAssign: Object.values(InputPropsDefault) },
      this.#input,
    );

    this.handleInput();
  }

  handleInput() {
    if (this.source.hasAttribute(InputProps.END_ADORNMENT)) {
      const endAdornment = this.source.getAttribute(InputProps.END_ADORNMENT);
      const btn = document.createElement('button');
      btn.setAttribute('color', 'inherit');
      const icon = new IconButton({
        source: btn,
        context: this,
        iconName: endAdornment,
        adornment: 'end',
      });

      if (this.source.hasAttribute(InputProps.END_ADORNMENT_ACTION)) {
        const actionName = this.source.getAttribute(
          InputProps.END_ADORNMENT_ACTION,
        );
        const action = this.extractPropContext(actionName);
        icon.setOnclick(action);
      }
      this.template.appendChild(icon.render());
    }

    if (this.source.hasAttribute(InputProps.START_ADORNMENT)) {
      const endAdornment = this.source.getAttribute(InputProps.START_ADORNMENT);
      const btn = document.createElement('button');
      btn.setAttribute('color', 'inherit');
      const icon = new IconButton({
        source: btn,
        context: this,
        iconName: endAdornment,
        adornment: 'start',
      });
      this.template.appendChild(icon.render());
    }
  }

  /**
   *
   * @param {HTMLDivElement} form
   */
  disableForm() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          // this.#disabledFieldDebounce(form);
          // console.log('patos', mutation.attributeName);
        }
      });
    });

    // Inicia a observação do elemento alvo
    observer.observe(this.#formField, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }

  /**
   *
   * @param {HTMLDivElement} form
   */
  disabledField() {
    const disabledClass = this.#formField.classList.contains('disabled');
    this.#input.disabled = disabledClass;
  }

  /**
   *
   * @param {HTMLDivElement} form
   */
  inputFormField() {
    this.#formField.addEventListener('click', () => {
      this.#input.focus();
    });

    const color = this.source.getAttribute('color');

    if (color) {
      this.#formField.style.setProperty('--text-input', color);
    }

    const bgColor = this.source.getAttribute('bgColor');

    if (bgColor) {
      this.#formField.style.setProperty('--text-input', color);
    }

    this.checkfieldEmpty(this.#input.value);
    this.#input.addEventListener('input', (event) => {
      this.checkfieldEmpty(event.currentTarget.value);
    });

    this.#input.addEventListener('blur', (event) => {
      if (!this.#formField.classList.contains(styles['no-validate-onblur'])) {
        setTimeout(() => {
          this.validateForm();
        }, 100);
      }
      this.checkfieldEmpty(event.currentTarget.value);
    });

    // inputElement.addEventListener('focus', (event) => {
    //   inputElement.setAttribute('touched', '');
    //   this.checkfieldEmpty(event.currentTarget.value, inputElement);
    // });
  }

  checkfieldEmpty(value) {
    if (value) {
      this.#formField.classList.add(styles['not-empty']);
    } else {
      this.#formField.classList.remove(styles['not-empty']);
    }
  }

  /**
   *
   * @param {Array.<HTMLInputElement>} inputs elemento que contem o path em texto
   */
  emitEventContainer(...inputs) {
    inputs.forEach((input) => {
      const event = new Event('input', {
        bubbles: true,
        cancelable: true,
      });
      input.dispatchEvent(event);
    });
  }

  /**
   * @param {HTMLDivElement} form
   * @param {string} error
   */
  showError(error, id) {
    const containerExists = this.#formField.querySelector('.container-error');

    const errorElement = document.createElement('span');
    errorElement.classList.add('error');
    errorElement.innerHTML = error;
    errorElement.id = id;
    this.#formField.style.setProperty(
      '--error-margin',
      (this.#formField.querySelectorAll('.error').length + 1) * 16 + 16 + 'px',
    );
    this.#formField.setAttribute('error', '');

    if (containerExists) {
      containerExists.appendChild(errorElement);
    } else {
      const containerError = document.createElement('div');
      containerError.classList.add('container-error');
      containerError.appendChild(errorElement);
      this.#formField.append(containerError);
    }
  }

  /**
   * @param {HTMLDivElement} form
   * @param {string?} id
   */
  hiddenError(id) {
    if (id) {
      this.#formField.querySelector(`#${id}`)?.remove();

      if (!this.#formField.querySelectorAll('.error').length) {
        this.#formField.removeAttribute('error');
        this.#formField.querySelector('.container-error')?.remove();
      }
    } else {
      this.#formField.removeAttribute('error');
      this.#formField.querySelector('.container-error')?.remove();
    }
  }

  /**
   * @param {HTMLElement} container
   * @param {boolean} ignoreTouched
   * @returns {number} número de errors
   */
  validateForms(container, ignoreTouched) {
    return Array.from(container.querySelectorAll('.form-field'))
      .filter((form) => !form.hasAttribute('ignore-make'))
      .map((form) => this.validateForm(form, ignoreTouched))
      .reduce((accu, curr) => accu + curr, 0);
  }

  /**
   * @param {HTMLDivElement} form
   * @param {boolean} ignoreTouched
   *
   * será checado a classe required e o atributo validate
   *
   * para o atributo validate, é experado um array de objetos de validação
   *
   * O objetos de validação deve ter duas propiedades message e regex
   *
   * @returns {number} número de errors
   */
  validateForm(ignoreTouched) {
    let countErrors = 0;
    /**
     * @typedef ValidateProp
     * @type {object}
     * @property {string} message - mesagem a ser exibida
     * @property {RegExp} regex - teste a ser realizado
     */

    /**  @type {ValidateProp| Array.<ValidateProp>} */
    const validates = this.handleValidateObject();

    const required = this.#formField.hasAttribute('required');

    this.hiddenError();
    const input = this.#formField.querySelector('.input-form-field');
    const touched = this.#input.hasAttribute('touched');
    if (
      required &&
      ((ignoreTouched && !input.value) || (!input.value && touched))
    ) {
      countErrors++;
      this.showError('Este campo é de preenchimento obrigatório.', 'required');
    }

    if (validates && touched) {
      if (Array.isArray(validates)) {
        let message = '';

        for (const validate of validates) {
          if (!validate.regex.test(input.value)) {
            message = validate.message;
            break;
          }
        }

        if (message) {
          countErrors++;
          this.showError(message);
        }
      } else {
        if (!validates.regex.test(input.value)) {
          countErrors++;
          this.showError(validates.message);
        }
      }
    }

    return countErrors;
  }

  handleValidateObject() {
    try {
      return eval(this.#formField.getAttribute('validate'));
    } catch (error) {
      console.error(error);
      const cloneContainer = this.#formField.cloneNode(true);
      cloneContainer.innerHTML = '';
    }
  }

  /**
   *
   * @param {HTMLDivElement} container
   */
  makeObject(container) {
    return Array.from(container.querySelectorAll('.form-field'))
      .map((form) => {
        const error = this.validateForm(form, true);
        if (!error && !form.hasAttribute('ignore-make')) {
          const radiogroup = !!form.querySelector('input[type="radio"]');
          const obj = {};

          if (radiogroup) {
            const checkedValue = form.querySelector(
              'input[type="radio"]:checked',
            );
            if (checkedValue) {
              obj[checkedValue.name] = checkedValue.value;
              return obj;
            }
          } else {
            const input = form.querySelector('.input-form-field');
            obj[input.name] = input.value;
            return obj;
          }
        }
      })
      .filter((value) => value)
      .reduce((accu, curr) => ({ ...accu, ...curr }), {});
  }

  /**
   *
   * @param {string} selector
   * @param {'off'|'on'} validate
   */
  getValue(selector, validate = 'on') {
    const element = document.querySelector(selector);
    if (element.classList.contains('input-form-field')) {
      if (validate === 'on') {
        const errors = this.validateForm(element.parentElement, true);
        if (errors) {
          throw new Error(
            `encontrado ${errors} errors para o campo ${element.id || element.getAttribute('name')}`,
          );
        }
      }

      const isRadio = element.type === 'radio';
      if (isRadio) {
        return element.parentElement.querySelector(
          `[name="${element.name}"]:checked`,
        )?.value;
      } else {
        return element.value;
      }
    } else if (element.classList.contains('form-field')) {
      const input = element.querySelector('.input-form-field');
      if (validate === 'on') {
        const errors = this.validateForm(element, true);
        if (errors) {
          throw new Error(
            `encontrado ${errors} errors para o campo ${input.id || input.getAttribute('name')}`,
          );
        }
      }

      const isRadio = element.classList.contains('radio-group');

      if (isRadio) {
        return element.querySelector(`.input-form-field:checked`)?.value;
      } else {
        return input.value;
      }
    }
  }

  /**
   *
   * @param {HTMLElement} selector
   */
  resetForm(selector) {
    const element = document.querySelector(selector);
    if (element.classList.contains('input-form-field')) {
      const isRadio = element.type === 'radio';

      if (isRadio) {
        const radioChecked = element.parentElement.querySelector(
          `[name="${element.name}"]:checked`,
        );
        if (radioChecked) {
          radioChecked.checked = false;
        }
        element.parentElement.removeAttribute('error');
      } else {
        element.value = '';
        element.removeAttribute('touched');
        element.parentElement.removeAttribute('error');
      }
    } else {
      const isRadio = element.type === 'radio';

      if (isRadio) {
        const radioChecked = element.querySelector(
          `[name="${element.name}"]:checked`,
        );
        if (radioChecked) {
          radioChecked.checked = false;
        }
        element.removeAttribute('error');
      } else {
        const input = element.querySelector('.input-form-field');
        input.value = '';
        input.removeAttribute('touched');
        element.removeAttribute('error');
      }
    }
  }
}
