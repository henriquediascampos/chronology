/**
 *
 * @typedef {object} BackgroundProp
 * @property {string} background
 * @property {string} paper
 *
 * @typedef {object} GrayScale
 * @property {string} 50
 * @property {string} 100
 * @property {string} 200
 * @property {string} 300
 * @property {string} 400
 * @property {string} 500
 * @property {string} 600
 * @property {string} 700
 *
 *
 * @typedef {object}  ColorProp
 * @property {string} main
 * @property {string} light
 * @property {string} dark
 * @property {string} contrastText
 *
 *
 * @typedef {object} Palette
 * @property {ColorProp} primary
 * @property {ColorProp} secondary
 * @property {BackgroundProp} background
 * @property {GrayScale} gray
 * @property {string} error
 * @property {string} info
 * @property {string} success
 * @property {string} warning
 *
 * @typedef {'light'|'dark'} TypeTheme
 *
 * @typedef {object} ThemeProp
 * @property {Palette} palette
 *
 *
 * @typedef {object} ConfigTheme
 * @property {ThemeProp} light
 * @property {ThemeProp} dark
 *
 * @typedef ComponentRef
 * @type {object}
 * @property {Component} type class/construtor do compoente Component
 * @property {string} ref tagname utilizada nesse contexto
 *
 * @typedef {object} ComponentProp
 * @property {string} templateString
 * @property {object} styles
 * @property {HTMLElement} source
 * @property {Component} context
 * @property {Array.<ComponentRef>}  componentsRef
 * @property {boolean} noExternalComponents
 * @property {boolean} compoentId
 * @property {boolean} updateState
 *
 * @typedef {object} Prop
 * @property {HTMLElement} source
 * @property {Component} context
 * @property {string} compoentId
 * @property {boolean} updateState
 *
 *
 * @typedef {object} NodeProp
 * @property {boolean} diff
 * @property {string} value
 *
 * @typedef {object} Tree
 * @property {string} type
 * @property {string} controlled
 * @property {string} toReconcile
 * @property {Tree[]} children
 * @property {NodeProp} props
 * @property {HTMLElement} element
 *
 * @typedef {object} ComponentItem
 * @property {string} id
 * @property {string} idParent
 * @property {BasicComponent} component
 * @property {Object.<string, ComponentItem>} childrens
 *
 *
 *
 */
