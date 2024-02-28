import { Componet } from "../../core/Component";
import template from "./Toolbar.html"
import { createElement } from "../../core/component-factory";
import style from "./Toolbar.css"

export class Toolbar extends Componet {
    constructor (){
        super(createElement(template), style, null, true)
    }
}