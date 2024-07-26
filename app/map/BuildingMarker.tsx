'use client'

import L, { LatLngExpression, LeafletMouseEventHandlerFn } from "leaflet";
import { Marker } from "react-leaflet";

export default function BuildingMarker({ position, color, children = undefined, onClick }:
  { position: LatLngExpression, color: string, children?: any, onClick?: LeafletMouseEventHandlerFn }) {
  return <Marker
    position={position}
    icon={L.icon({
      iconUrl: `https://img.icons8.com/ios-filled/100/${color.replace("#", "")}/100-percents.png`,
      iconSize: L.point(14, 14),
      iconAnchor: L.point(7, 7),
      className: 'marker',
    })}
    eventHandlers={{
      click: onClick
    }}
  >
    {children}
  </Marker>
}
