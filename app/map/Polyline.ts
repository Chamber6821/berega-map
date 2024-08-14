import { GeoJSONSource, LngLat, Map } from 'mapbox-gl'

export default class Polyline {
  private readonly geoJson: GeoJSON.Feature<GeoJSON.LineString> = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: []
    }
  }

  constructor (
    private readonly map: Map,
    private readonly id: string,
    colors: {
      color: string
      width: number
    },
    path: LngLat[] = []
  ) {
    map.once('style.load', () => {
      map.addSource(id, {
        type: 'geojson',
        data: this.geoJson
      })
      map.addLayer({
        id: this.id,
        type: 'line',
        source: id,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': colors.color,
          'line-width': colors.width
        }
      })
      this.path = path
    })
  }

  get path () { return this.geoJson.geometry.coordinates.map(x => new LngLat(x[0], x[1])) }
  set path (path: LngLat[]) {
    this.geoJson.geometry.coordinates = path.map(x => [x.lng, x.lat]);
    (this.map.getSource(this.id) as GeoJSONSource).setData(this.geoJson)
  }

  show () { this.map.setLayoutProperty(this.id, 'visibility', 'visible') }
  hide () { this.map.setLayoutProperty(this.id, 'visibility', 'none') }
}
