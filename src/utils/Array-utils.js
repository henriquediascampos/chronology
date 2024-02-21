/**
 * @param {Array<object>} array 
 * @param {string} propriedade 
 * @returns {boolean} true se houver duplicidade
 */
export function checkDuplicatedValue(array, propriedade) {
  const valores = array.map(objeto => objeto[propriedade]);
  return new Set(valores).size !== valores.length;
}