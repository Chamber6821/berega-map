'use client'

import L, { LatLngBounds, LatLngExpression } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import SelectionArea from "./SelectionArea";
import { useState } from "react";
import Control from "react-leaflet-custom-control";
import "leaflet/dist/leaflet.css"
import ViewBounds from "./ViewBounds";

export type Bounds = L.LatLngBounds

export default function Map({ center, zoom, onBoundsChanged, children }:
  { center: LatLngExpression, zoom: number, onBoundsChanged?: (bounds: LatLngBounds) => void, children: any }) {
  const [drawMode, setDrawMode] = useState(false)
  return <MapContainer
    center={center}
    zoom={zoom}
    scrollWheelZoom={true}
  >
    <TileLayer
      url="https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=uL0rwqFI3ByfHOEQrTJP"
    />
    {children}
    <SelectionArea drawing={drawMode} />
    <ViewBounds onChanged={onBoundsChanged} />
    <Control prepend position="topright">
      {
        drawMode
          ?
          <button className="map-button" onClick={() => setDrawMode(false)}>
            <p>Закончить выделение</p>
          </button>
          :
          <button className="map-button" onClick={() => setDrawMode(true)}>
            <p>Выделить область</p>
          </button>
      }
    </Control>
  </MapContainer >
}
