'use client';

import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import BuildingMarker from "./BuildingMarker";

export default function Map() {
  return <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <BuildingMarker
      position={[51.505, -0.09]}
      color="#395296"
    >
      <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
    </BuildingMarker>
    <BuildingMarker
      position={[51.505, 0]}
      color="#439639"
    >
      <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
    </BuildingMarker>
  </MapContainer>
}
