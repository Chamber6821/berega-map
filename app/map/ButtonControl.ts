import { IControl, Map } from 'mapbox-gl'
import { createElement } from '../utils'
import { MutableRefObject } from 'react'

export default class ButtonControl implements IControl {
  constructor (private readonly options: {
    innerHtml: string
    ref?: MutableRefObject<HTMLElement | undefined>
    on?: {
      click?: (this: HTMLDivElement, ev: MouseEvent) => void
    }
  }) { }

  onAdd (map: Map) {
    const element = createElement(`<button>${this.options.innerHtml}</button>`)
    element.classList.add('mapboxgl-ctrl', 'mapboxgl-ctrl-group')
    ;(this.options.ref != null) && (this.options.ref.current = element)
    const clickHandler = this.options?.on?.click
    ;(clickHandler != null) && element.addEventListener('click', clickHandler)
    return element
  }

  onRemove (map: Map) { }
}
