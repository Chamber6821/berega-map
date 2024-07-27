import { GeoJSONSource, LngLat, Map } from "mapbox-gl"
import { inside } from '../utils'

export default class Polygon {
  private geoJson: GeoJSON.Feature<GeoJSON.Polygon> = {
    'type': 'Feature',
    'properties': {},
    'geometry': {
      'type': 'Polygon',
      'coordinates': []
    }
  }

  constructor(
    private map: Map,
    private id: string,
    colors: {
      borderColor: string,
      borderWidth: number,
      fillColor: string,
      fillOpacity: number,
    },
    path: LngLat[] = []
  ) {
    map.once('style.load', () => {
      map.addSource(id, {
        type: 'geojson',
        data: this.geoJson
      })
      map.addLayer({
        id: this.lineLayerId(),
        type: 'line',
        source: id,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': colors.borderColor,
          'line-width': colors.borderWidth
        }
      })
      map.addLayer({
        id: this.fillLayerId(),
        type: 'fill',
        source: id,
        layout: {},
        paint: {
          'fill-color': colors.fillColor,
          'fill-opacity': colors.fillOpacity
        }
      })
      this.path = path
    })
  }

  get path() { return this.geoJson.geometry.coordinates[0].map(x => new LngLat(x[0], x[1])).slice(0, -1) }
  set path(path: LngLat[]) {
    const copy = [...path]
    if (copy.length > 0 && copy[0].toString() !== copy[copy.length - 1].toString())
      copy.push(copy[0])
    if (copy.length == 1) copy.push(copy[0])
    this.geoJson.geometry.coordinates[0] = copy.map(x => [x.lng, x.lat]);
    (this.map.getSource(this.id) as GeoJSONSource).setData(this.geoJson)
  }

  show() {
    this.map.setLayoutProperty(this.lineLayerId(), 'visibility', 'visible')
    this.map.setLayoutProperty(this.fillLayerId(), 'visibility', 'visible')
  }
  hide() {
    this.map.setLayoutProperty(this.lineLayerId(), 'visibility', 'none')
    this.map.setLayoutProperty(this.fillLayerId(), 'visibility', 'none')
  }

  contains(point: LngLat) {
    return inside([point.lat, point.lng], this.path.map(x => [x.lat, x.lng]))
  }

  private lineLayerId() { return this.id + '-line' }
  private fillLayerId() { return this.id + '-fill' }
}


