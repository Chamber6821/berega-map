'use client'

import { useEffect, useRef } from "react";
import { Building } from "../api/berega";

import mapbox, { GeoJSONSource, LngLatBounds, Map as MapboxMap, MapMouseEvent, MapTouchEvent, Marker, NavigationControl } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import Polygon from "./Polygon";
import Polyline from "./Polyline";
import ButtonControl from "./ButtonControl";
import { create } from "zustand";
import ViewButtonControl from "./ViewButtonControl";

export type Bounds = LngLatBounds

export const useMap = create<{
  bounds?: Bounds, selectedArea?: Polygon,
  selectedBuilding?: Building
  setBounds: (bounds?: Bounds) => void,
  setSelectedArea: (selectedArea?: Polygon) => void
  setSelectedBuilding: (building: Building | undefined) => void
}>(set => ({
  setBounds: (bounds) => set({ bounds }),
  setSelectedArea: (selectedArea) => set({ selectedArea }),
  setSelectedBuilding: (building) => set({ selectedBuilding: building })
}))

export default function Map({ center, zoom, buildings }: { center: [number, number], zoom: number, buildings: Building[] }) {
  const mapState = useMap()
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map>()

  useEffect(() => {
    mapbox.accessToken = "pk.eyJ1IjoiY2hhbWJlcjY4MjEiLCJhIjoiY2xyZjY4MDBrMDF0bjJrbzU0djA2bnJueCJ9.sTgEkqcR0I_Yqjl0CTOQvA"
    mapRef.current = new MapboxMap({
      container: mapContainer.current as HTMLDivElement,
      center: [center[1], center[0]],
      zoom: zoom,
    })
    const map = mapRef.current as MapboxMap
    const polygon = new Polygon(map, 'polygon', {
      borderColor: '#439639',
      borderWidth: 4,
      fillColor: '#439639',
      fillOpacity: 0.3
    })
    const polyline = new Polyline(map, 'polyline', {
      color: '#439639',
      width: 4
    })

    let draw = false
    let drawing = false
    const drawingStart = () => {
      if (!draw) return
      polygon.path = []
      polygon.hide()
      polyline.path = []
      polyline.show()
      map.dragPan.disable()
      drawing = true
    }
    const drawingMove = (e: MapMouseEvent | MapTouchEvent) => {
      if (drawing) polyline.path = [...polyline.path, e.lngLat]
    }
    const drawingEnd = () => {
      if (!draw) return
      drawing = false
      draw = false
      map.dragPan.enable()
      polygon.path = polyline.path
      polyline.hide()
      polygon.show()
      mapState.setSelectedArea(polygon)
    }
    map
      .addControl(new NavigationControl({ visualizePitch: true }))
      .addControl(new ButtonControl({
        innerHtml: '<img style="margin: 4px" width=21 height=21 src="https://img.icons8.com/glyph-neue/64/polygon.png"/>',
        on: {
          click: () => {
            draw = !draw
            mapState.setSelectedArea(undefined)
            polygon.hide()
          }
        }
      }), 'top-right')
      .addControl(
        new ViewButtonControl(map, {
          pitch: 0,
          zoom: zoom
        }, {
          pitch: 80,
          zoom: 16
        }),
        'top-right')
      .on('mousedown', drawingStart)
      .on('mousemove', drawingMove)
      .on('mouseup', drawingEnd)
      .on('touchstart', drawingStart)
      .on('touchmove', drawingMove)
      .on('touchend', drawingEnd)
      .on('moveend', () => mapState.setBounds(map.getBounds() || undefined))

    type Marker = {
      color: string,
      originIndex: number,
    }
    const geoJsonMarkers: GeoJSON.FeatureCollection<GeoJSON.Point, Marker> = {
      'type': 'FeatureCollection',
      'features': buildings.map(
        (x, i) => ({
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [x.lng, x.lat]
          },
          'properties': {
            'color': x.color,
            'originIndex': i
          }
        })
      )
    }

    map.once('style.load', () => {
      map.addSource('markers', {
        type: 'geojson',
        data: geoJsonMarkers
      })
      map.addLayer({
        id: 'markers',
        type: 'circle',
        source: 'markers',
        paint: {
          'circle-color': ['get', 'color'],
          'circle-radius': 7,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      })
      map.addSource('selected-marker', {
        type: 'geojson',
        data: {
          'type': 'FeatureCollection',
          'features': []
        }
      })
      map.addLayer({
        id: 'selected-marker',
        type: 'circle',
        source: 'selected-marker',
        paint: {
          'circle-color': ['get', 'color'],
          'circle-radius': 7,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      })
      map.moveLayer('markers', 'selected-marker')
      map.on('click', 'markers', (e) => {
        const marker = e.features?.[0]?.properties as Marker | undefined
        marker && mapState.setSelectedBuilding(buildings[marker.originIndex])
      })
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    const selectedMarker = map.getSource<GeoJSONSource>('selected-marker')
    if (!selectedMarker) return
    const building = mapState.selectedBuilding
    if (building) {
      console.log('select building', building)
      selectedMarker.setData({
        'type': 'FeatureCollection',
        'features': [
          {
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': [building.lng, building.lat]
            },
            'properties': {
              'color': '#ff8000'
            }
          }
        ]
      })
    } else {
      console.log('deselect building')
      selectedMarker.setData({
        'type': 'FeatureCollection',
        'features': []
      })
    }
    console.log(map.getSource<GeoJSONSource>('selected-marker')?._data)
  }, [mapState.selectedBuilding])


  return <div className="map" ref={mapContainer}></div>
}
