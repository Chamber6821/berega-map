'use client'

import { useEffect, useRef } from "react";
import { Building } from "../api/berega";
import { createElement } from "../utils";

import mapbox, { Map as MapboxMap, Marker, NavigationControl } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import Polygon from "./Polygon";
import Polyline from "./Polyline";
import ButtonControl from "./ButtonControl";
import { LngLatBounds } from "@maptiler/sdk";
import { create } from "zustand";

export type Bounds = LngLatBounds

export const useMap = create<{
  bounds?: Bounds, selectedArea?: Polygon
  setBounds: (bounds?: Bounds) => void,
  setSelectedArea: (selectedArea?: Polygon) => void
}>(set => ({
  setBounds: (bounds) => set({ bounds }),
  setSelectedArea: (selectedArea) => set({ selectedArea }),
}))

export default function Map({ center, zoom, buildings, onMarkerClick }: { center: [number, number], zoom: number, buildings: Building[], onMarkerClick?: (buildign: Building) => void }) {
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
      .on('mousedown', () => {
        if (!draw) return
        polygon.path = []
        polygon.hide()
        polyline.path = []
        polyline.show()
        map.dragPan.disable()
        drawing = true
      })
      .on('mousemove', e => {
        if (drawing) polyline.path = [...polyline.path, e.lngLat]
      })
      .on('mouseup', () => {
        if (!draw) return
        drawing = false
        draw = false
        map.dragPan.enable()
        polygon.path = polyline.path
        polyline.hide()
        polygon.show()
        mapState.setSelectedArea(polygon)
      })
      .on('moveend', () => mapState.setBounds(map.getBounds() || undefined))

    buildings.map(x =>
      new Marker({
        element: createElement(`<img width="14px" src="https://img.icons8.com/ios-filled/100/${x.color.replace("#", "")}/100-percents.png"/>`),
        className: 'marker'
      })
        .setLngLat([x.lng, x.lat])
        .addTo(mapRef.current as MapboxMap)
        .getElement().addEventListener('click', () => onMarkerClick && onMarkerClick(x))
    )
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <div className="map" ref={mapContainer}></div>
}
