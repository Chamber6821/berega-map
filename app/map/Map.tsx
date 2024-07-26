'use client'

import L, { LatLngBounds, LatLngExpression } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import SelectionArea from "./SelectionArea";
import { useState } from "react";
import Control from "react-leaflet-custom-control";
import "leaflet/dist/leaflet.css"
import ViewBounds from "./ViewBounds";

const iconForCluster = (cluster: any) => L.divIcon({
  html: `<p>${cluster.getChildCount()}</p>`,
  className: 'cluster-icon',
  iconSize: L.point(30, 30)
})

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
    <MarkerClusterGroup
      iconCreateFunction={iconForCluster}
      maxClusterRadius={40}
    >
      {children}
    </MarkerClusterGroup>
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
