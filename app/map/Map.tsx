'use client'

import { useEffect, useRef, useState } from "react";
import { Building } from "../api/berega";

import mapbox, { GeoJSONSource, LngLatBounds, Map as MapboxMap, MapMouseEvent, MapTouchEvent, NavigationControl } from 'mapbox-gl'
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
  const setSelectedArea = useMap(x => x.setSelectedArea)
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map>()
  const polygonRef = useRef<Polygon>()
  const polylineRef = useRef<Polyline>()
  const drawingButtonRef = useRef<HTMLElement>()
  const [mode, setMode] = useState<'loading' | 'view' | 'draw' | 'drawing' | 'filtered'>('loading')
  const modeRef = useRef(mode)

  useEffect(() => {
    modeRef.current = mode
    switch (mode) {
      case 'view': {
        polygonRef.current?.hide()
        polylineRef.current?.hide()
        drawingButtonRef.current?.classList.remove('button-pressed')
        setSelectedArea(undefined)
        break
      }
      case 'draw': {
        mapRef.current?.dragPan?.disable()
        polygonRef.current?.hide()
        if (polylineRef.current) {
          polylineRef.current.path = []
          polylineRef.current.show()
        }
        drawingButtonRef.current?.classList.add('button-pressed')
        break
      }
      case 'drawing': {
        // nothing
        break;
      }
      case 'filtered': {
        if (polygonRef.current && polylineRef.current)
          polygonRef.current.path = polylineRef.current.path
        polygonRef.current?.show()
        polylineRef.current?.hide()
        setSelectedArea(polygonRef.current)
        mapRef.current?.dragPan?.enable()
        break
      }
    }
  }, [mode, setSelectedArea])

  useEffect(() => {
    mapbox.accessToken = "pk.eyJ1IjoiY2hhbWJlcjY4MjEiLCJhIjoiY2xyZjY4MDBrMDF0bjJrbzU0djA2bnJueCJ9.sTgEkqcR0I_Yqjl0CTOQvA"
    mapRef.current = new MapboxMap({
      container: mapContainer.current as HTMLDivElement,
      center: [center[1], center[0]],
      zoom: zoom,
    })
    polygonRef.current = new Polygon(mapRef.current, 'polygon', {
      borderColor: '#439639',
      borderWidth: 4,
      fillColor: '#439639',
      fillOpacity: 0.3
    })
    polylineRef.current = new Polyline(mapRef.current, 'polyline', {
      color: '#439639',
      width: 4
    })

    const map = mapRef.current
    const polyline = polylineRef.current

    const drawingStart = () => (modeRef.current == 'draw') && setMode('drawing')
    const drawingMove = (e: MapMouseEvent | MapTouchEvent) =>
      (modeRef.current == 'drawing') && (polyline.path = [...polyline.path, e.lngLat])
    const drawingEnd = () => (modeRef.current == 'drawing') && setMode('filtered')
    map
      .addControl(new NavigationControl({ visualizePitch: true }))
      .addControl(new ButtonControl({
        innerHtml: '<img style="margin: 4px" width=21 height=21 src="https://img.icons8.com/glyph-neue/64/polygon.png"/>',
        ref: drawingButtonRef,
        on: {
          click: () => {
            setMode({
              'loading': 'loading',
              'view': 'draw',
              'draw': 'view',
              'drawing': 'filtered',
              'filtered': 'view'
            }[modeRef.current] as 'view' | 'draw' | 'drawing' | 'filtered')
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
      .once('style.load', () => setMode('view'))

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
