'use client'

import L, { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

const iconForCluster = (cluster: any) => L.divIcon({
  html: `<p>${cluster.getChildCount()}</p>`,
  className: 'cluster-icon',
  iconSize: L.point(30, 30)
})

export default function Map({ center, zoom, children }: { center: LatLngExpression, zoom: number, children: any }) {
  return <MapContainer center={center} zoom={zoom} scrollWheelZoom={true}>
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <MarkerClusterGroup
      iconCreateFunction={iconForCluster}
      maxClusterRadius={40}
    >
      {children}
    </MarkerClusterGroup>
  </MapContainer>
}
