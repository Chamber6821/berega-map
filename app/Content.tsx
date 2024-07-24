'use client'

import { useState } from "react";
import { Building } from "./api/berega";
import Cards from "./Cards";
import { BuildingMarker, Map } from "./map";
import Popup from "./Popup";
import { average } from "./utils";
import FiltersPopup from "./filters/FiltersPopup";

export default function Content({ buildings }:
  { buildings: Building[] }) {
  const [popupBuilding, setPopupBuilding] = useState<Building | null>(null)
  const [showFiltersPopup, setShoFiltersPopup] = useState(true)
  return <div className="root-container">
    <Map
      center={[average(buildings.map(x => x.lat)), average(buildings.map(x => x.lng))]}
      zoom={6}
    >
      {
        buildings.map(x =>
          <BuildingMarker
            key={x.page}
            position={[x.lat, x.lng]}
            color={x.color}
            onClick={() => setPopupBuilding(x)}
          />)
      }
    </Map>
    <Cards buildings={buildings} />
    {popupBuilding && <Popup building={popupBuilding} onClose={() => setPopupBuilding(null)} />}
    {showFiltersPopup && <FiltersPopup onClose={() => setShoFiltersPopup(false)} />}
  </div >

}
