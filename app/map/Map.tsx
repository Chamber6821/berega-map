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
import { clamp, inside } from "../utils";
import debounce from "debounce";
import intersect from "@turf/intersect";

export type Bounds = LngLatBounds

export const useMap = create<{
  bounds?: Bounds, selectedArea?: Polygon,
  selectedBuilding?: Building[]
  setBounds: (bounds?: Bounds) => void,
  setSelectedArea: (selectedArea?: Polygon) => void
  setSelectedBuilding: (building: Building[] | undefined) => void
}>(set => ({
  setBounds: (bounds) => set({ bounds }),
  setSelectedArea: (selectedArea) => set({ selectedArea }),
  setSelectedBuilding: (building) => set({ selectedBuilding: building })
}))

const colorFor = (x: Building) => {
  switch (x.group) {
    case 'Новостройки': return '#df11ff'
    case 'Вторичное жилье': return '#0000ff'
    case 'Дома, коттеджи': return '#ff0000'
    case 'Зем. участки': return '#994009'
    case 'Коммерческая': return '#ffa640'
  }
}

const markerRadius = 5

export default function Map({ center, zoom, buildings, onClickInfo }:
  { center: [number, number], zoom: number, buildings: Building[], onClickInfo?: () => void }) {
  const mapState = useMap()
  const mapStateRef = useRef(mapState)
  const setSelectedArea = useMap(x => x.setSelectedArea)
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map>()
  const polygonRef = useRef<Polygon>()
  const polylineRef = useRef<Polyline>()
  const drawingButtonRef = useRef<HTMLElement>()
  const [mode, setMode] = useState<'loading' | 'view' | 'draw' | 'drawing' | 'filtered'>('loading')
  const modeRef = useRef(mode)
  const buildingsRef = useRef(buildings)
  buildingsRef.current = buildings
  mapStateRef.current = mapState

  const updateBuildings = (map: MapboxMap) => {
    const coloredBuildingsSource = map.getSource('colored-buildings') as GeoJSONSource
    const simpleBuildingsSource = map.getSource('simple-buildings') as GeoJSONSource
    return () => {
      const buildings = map.queryRenderedFeatures(undefined, { layers: ['building'], filter: ['==', 'extrude', 'true'] })
      const markers = map.queryRenderedFeatures(undefined, { layers: ['markers'] }).sort()
      const mask = buildings.map(x =>
        markers.filter(y =>
          inside(
            (y.geometry as GeoJSON.Point).coordinates as [number, number],
            (x.geometry as GeoJSON.Polygon).coordinates[0] as [number, number][]
          )
        )
      )
      const coloredBuildings = buildings
        .map((x, i) => ({
          ...x,
          geometry: x.geometry,
          properties: {
            ...x.properties,
            color: mask[i][0]?.properties?.color,
            originIndexes: JSON.stringify(mask[i].map(x => x?.properties?.originIndex))
          }
        }))
        .filter((_, i) => mask[i].length > 0)
      const simpleBuildings = buildings.filter((_, i) => mask[i].length === 0)

      const toRemove: number[] = []
      coloredBuildings.forEach((colored) => {
        simpleBuildings.forEach((simple, j) => {
          if (intersect({
            type: 'FeatureCollection',
            features: [
              colored as GeoJSON.Feature<GeoJSON.Polygon>,
              simple as GeoJSON.Feature<GeoJSON.Polygon>
            ]
          })) {
            coloredBuildings.push({
              ...simple,
              geometry: simple.geometry,
              properties: {
                ...simple.properties,
                ...colored.properties,
                color: colored.properties.color
              }
            })
            toRemove.push(j)
          }
        })
      })
      toRemove.reverse().forEach(i => simpleBuildings.splice(i, 1))

      coloredBuildingsSource.setData({ 'type': 'FeatureCollection', 'features': coloredBuildings })
      simpleBuildingsSource.setData({ 'type': 'FeatureCollection', 'features': simpleBuildings })
    }
  }

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
        if (mapRef.current) {
          mapRef.current.dragPan.disable()
          mapRef.current.getCanvas().style.cursor = 'crosshair'
        }
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
        if (mapRef.current) {
          mapRef.current.dragPan.enable()
          mapRef.current.getCanvas().style.cursor = ''
        }
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
      style: 'mapbox://styles/mapbox/streets-v12',
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
      .addControl(new ButtonControl({
        innerHtml: '<img style="margin: 4px" width=21 height=21 src="https://img.icons8.com/ios/50/info--v1.png"/>',
        on: {
          click: onClickInfo
        }
      }), 'top-right')
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
            'coordinates': [x.location.lng, x.location.lat]
          },
          'properties': {
            'color': colorFor(x),
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
          'circle-radius': markerRadius,
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
          'circle-radius': markerRadius,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      })
      map.moveLayer('markers', 'selected-marker')
      map.on('click', 'markers', (e) => {
        const marker = e.features?.[0]?.properties as Marker | undefined
        marker && mapState.setSelectedBuilding([buildingsRef.current[marker.originIndex]])
      })
      map
        .on('mouseenter', 'markers', () => ['view', 'filtered'].includes(modeRef.current) && (map.getCanvas().style.cursor = 'pointer'))
        .on('mouseleave', 'markers', () => ['view', 'filtered'].includes(modeRef.current) && (map.getCanvas().style.cursor = ''))
    })

    map.once('style.load', () => {
      const emptyFeatureCollection: GeoJSON.FeatureCollection = {
        'type': 'FeatureCollection',
        'features': []
      }
      const labelLayerId = map.getStyle()?.layers?.find(x => x.type === 'symbol' && x.layout?.['text-field'])?.id;
      map
        .addSource('colored-buildings', { type: 'geojson', data: emptyFeatureCollection })
        .addSource('simple-buildings', { type: 'geojson', data: emptyFeatureCollection })
        .addLayer({
          id: 'colored-buildings',
          source: 'colored-buildings',
          type: 'fill-extrusion',
          minzoom: 15,
          paint: {
            'fill-extrusion-color': ['get', 'color'],
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': ['get', 'min_height'],
            'fill-extrusion-vertical-gradient': false,
          }
        }, labelLayerId)
        .addLayer({
          id: 'simple-buildings',
          source: 'simple-buildings',
          type: 'fill-extrusion',
          minzoom: 15,
          paint: {
            'fill-extrusion-color': '#ddddd1',
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': ['get', 'min_height'],
            'fill-extrusion-vertical-gradient': false,
          },
        }, labelLayerId)
        .on('click', 'colored-buildings', (e) => {
          const marker = e.features?.[0]?.properties
          if (!marker) return
          const newMarkers = JSON.parse(marker.originIndexes).map((i: number) => buildingsRef.current[i]) as Building[]
          const currentData = JSON.stringify(mapStateRef.current.selectedBuilding?.flatMap(x => [x.location.lat, x.location.lng]))
          const newData = JSON.stringify(newMarkers.flatMap(x => [x.location.lat, x.location.lng]))
          console.log(currentData)
          console.log(newData)
          if (currentData === newData) {
            mapState.setSelectedBuilding(undefined)
          } else {
            mapState.setSelectedBuilding(newMarkers)
          }
        })
      const update = updateBuildings(map)
      map
        .on('move', debounce(update))
        .on('sourcedata', e => {
          if (e.sourceId !== 'markers') return
          update()
        })
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const selectedMarker = map.getSource<GeoJSONSource>('selected-marker')
    if (!selectedMarker) return
    const building = mapState.selectedBuilding
    if (building) {
      console.log('select building', building)
      selectedMarker.setData({
        'type': 'FeatureCollection',
        'features': building.map(x => ({
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [x.location.lng, x.location.lat]
          },
          'properties': {
            'color': '#ff8000'
          }
        })
        )
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

  useEffect(() => {
    console.log('UPDATE MARKERS!')
    if (!mapRef.current) return
    const map = mapRef.current
    map.getSource<GeoJSONSource>('markers')?.setData({
      'type': 'FeatureCollection',
      'features': buildings.map(
        (x, i) => ({
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [x.location.lng, x.location.lat]
          },
          'properties': {
            'color': colorFor(x),
            'originIndex': i
          }
        })
      )
    })
  }, [buildings.length])


  return <div className="map" ref={mapContainer}></div>
}
