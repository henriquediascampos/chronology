import { render } from "./component-factory";

export class Componet {
  /**
   * @typedef ComponentRef
   * @type {object}
   * @property {Componet} type class/construtor do compoente
   * @property {string} ref tagname utilizada nesse contexto
   *
   * @type  {Array.<ComponentRef>}
   */
  componentsRef;

  noExternalComponents = false;

  /**
   * @type {Element | HTMLCollection}
   */
  template;

  /**
   * 
   * @param {Element | HTMLCollection} template
   * @param {Array.<ComponentRef>}  componentsRef 
   * @param {boolean} noExternalComponents 
   */
  constructor(template, componentsRef, noExternalComponents) {

    this.template = template;
    this.componentsRef = componentsRef
    this.noExternalComponents = noExternalComponents;

    if (!this.template) {
      throw new Error("Você não definiu template para seu componente! Importe seu html e use a função createElement de `component-factory` e passe seu string-html para criar seu template.");
    }

    if (!this.noExternalComponents && !this.componentsRef?.length) {
      throw new Error(`Você não definiu nenhuma referencia para seu componente!!!
          se você estiver usando componentes externos a este componente, você definir as referencias do mesmo nesta variavel 
          ex: 
            constructor() {
              this.componentsRef = [
                {
                  type: Button,
                  ref: 'app-button'
                },
                {
                  type: Dialog,
                  ref: 'app-dialog'
                }
              ]
            }
          
          se não for o caso defina a propriedade noExternalComponents pra true`
      );
    }

    if (this.componentsRef && !Array.isArray(this.componentsRef)) {
      throw new Error(`componentsRef deve ser uma array de ComponentRef!!!`);
    }

    if (this.componentsRef?.length && this.componentsRef.some(c => !(c.type.prototype instanceof Componet))) {
      throw new Error(`ComponentRef deve sempre ter o parametro type do tipo Component!!!`);
    }

  }

  render() {
    return render(this);
  }
}
