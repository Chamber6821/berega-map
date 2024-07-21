'use client';

import { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";

export default function Map({ center, zoom, children }: { center: LatLngExpression, zoom: number, children: any }) {
  return <MapContainer center={center} zoom={zoom} scrollWheelZoom={true}>
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {children}
  </MapContainer>
}
