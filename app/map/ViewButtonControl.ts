import { EasingOptions, Map } from 'mapbox-gl'
import ButtonControl from './ButtonControl'

export default class ViewButtonControl extends ButtonControl {
  constructor (map: Map, view2d: EasingOptions, view3d: EasingOptions) {
    super({
      innerHtml: '3D',
      on: {
        click: function () {
          const button = this.children.item(0) as HTMLButtonElement
          switch (button.textContent) {
            case '2D': {
              button.textContent = '3D'
              map.flyTo(view2d)
              break
            }
            case '3D': {
              button.textContent = '2D'
              map.flyTo(view3d)
              break
            }
          }
        }
      }
    })
  }
}
