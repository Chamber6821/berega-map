'use client'

import { Building } from "./api/berega";
import Cards from "./Cards";
import { BuildingMarker, Map } from "./map";
import { average } from "./utils";

export default function Content({ buildings }:
  { buildings: Building[] }) {
  return <div className="root-container">
    <Map
      center={[average(buildings.map(x => x.lat)), average(buildings.map(x => x.lng))]}
      zoom={6}
    >
      {
        buildings
          .map(x => <BuildingMarker key={x.page} position={[x.lat, x.lng]} color={x.color} />)
      }
    </Map>
    <Cards buildings={buildings} />
  </div >

}
