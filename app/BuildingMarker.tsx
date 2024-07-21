'use client'

import L, { LatLngExpression } from "leaflet";
import { Marker } from "react-leaflet";

export default function BuildingMarker({ position, color, children = undefined }:
  { position: LatLngExpression, color: string, children?: any }) {
  return <Marker
    position={position}
    icon={L.icon({
      iconUrl: `https://img.icons8.com/ios-filled/100/${color.replace("#", "")}/100-percents.png`,
      iconSize: L.point(20, 20),
      iconAnchor: L.point(10, 10)
    })}
  >
    {children}
  </Marker>
}
