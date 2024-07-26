'use client'

import L, { LatLngExpression, LeafletMouseEventHandlerFn } from "leaflet";
import { Marker } from "react-leaflet";

export default function BuildingMarker({ position, color, children = undefined, onClick }:
  { position: LatLngExpression, color: string, children?: any, onClick?: LeafletMouseEventHandlerFn }) {
  const size = 12
  return <Marker
    position={position}
    icon={L.icon({
      iconUrl: `https://img.icons8.com/ios-filled/100/${color.replace("#", "")}/100-percents.png`,
      iconSize: L.point(size, size),
      iconAnchor: L.point(size / 2, size / 2),
      className: 'marker',
    })}
    eventHandlers={{
      click: onClick
    }}
  >
    {children}
  </Marker>
}
