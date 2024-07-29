import { IControl, Map } from "mapbox-gl";
import { createElement } from "../utils";

export default class ButtonControl implements IControl {
  constructor(private options: {
    innerHtml: string,
    on?: {
      click?: () => void
    }
  }) { }

  onAdd(map: Map) {
    const element = createElement(`<button>${this.options.innerHtml}</button>`)
    element.classList.add("mapboxgl-ctrl", "mapboxgl-ctrl-group")
    const clickHandler = this.options?.on?.click
    clickHandler && element.addEventListener('click', clickHandler)
    return element
  }

  onRemove(map: Map) { }
}
