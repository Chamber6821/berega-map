'use client';

import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

export default function Map() {
  return <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker
      position={[51.505, -0.09]}
      icon={L.icon({
        iconUrl: "https://img.icons8.com/ios-filled/100/395296/100-percents.png",
        iconSize: L.point(20, 20),
        iconAnchor: L.point(10, 10)
      })}
    >
      <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
    </Marker>
    <Marker
      position={[51.505, 0]}
      icon={L.icon({
        iconUrl: "https://img.icons8.com/ios-filled/100/439639/100-percents.png",
        iconSize: L.point(20, 20),
        iconAnchor: L.point(10, 10)
      })}
    >
      <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
    </Marker>
  </MapContainer>
}
