import { checkDuplicatedValue } from "../utils/Array-utils";
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
      throw new Error(`Você não definiu nenhuma referencia para seu componente ${this.constructor.name}!!!
          se você estiver usando componentes externos a ${this.constructor.name}, você deve definir as referencias dos mesmos na variável componentsRef
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
          
          se não for o caso, defina a propriedade noExternalComponents para true`
      );
    }

    if (this.componentsRef && !Array.isArray(this.componentsRef)) {
      throw new Error(`componentsRef deve ser uma array de ComponentRef!!!`);
    }

    if (this.componentsRef?.length) {
      if (this.componentsRef.some(c => !(c.type.prototype instanceof Componet))) {
        throw new Error(
          `ComponentRef deve sempre ter o parametro type do tipo Component!!! Cheque os componentes: ${
            this.componentsRef
              .filter((c) => !(c.type.prototype instanceof Componet))
              .map(c => c.type.name)
              .join(",")}`
        );
      }
      
      if (checkDuplicatedValue(this.componentsRef, 'ref')) {
        throw new Error(`Voce não pode ter refências duplicadas!!! 
          olhe seu componete ${this.constructor.name} e verifique as referências que você está passando para o construtor!`);
      }
    }
  }

  render() {
    return render(this);
  }
}
