'use client'

import { useState } from "react";
import { Building } from "./api/berega";
import Cards from "./Cards";
import { BuildingMarker, Map } from "./map";
import Popup from "./Popup";
import { average, clamp, colorFromHex, colorToHex, gradient, logIt } from "./utils";
import FiltersPopup from "./filters/FiltersPopup";
import FiltersHeader from "./filters/FiltersHeader";

const monthAgo = () => {
  const now = new Date()
  now.setMonth(now.getMonth() - 1)
  return now
}

export default function Content({ buildings }:
  { buildings: Building[] }) {
  const [popupBuilding, setPopupBuilding] = useState<Building | null>(null)
  const [showFiltersPopup, setShowFiltersPopup] = useState(false)
  const grad = gradient(colorFromHex('#595f58'), colorFromHex('#00ff33'))
  const now = new Date().getTime()
  const timeBound = monthAgo().getTime()
  const delta = now - timeBound
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <FiltersHeader onOpenFilters={() => setShowFiltersPopup(true)} />
      {showFiltersPopup && <FiltersPopup onClose={() => setShowFiltersPopup(false)} />}
      <div className="root-container">
        <Map
          center={[average(buildings.map(x => x.lat)), average(buildings.map(x => x.lng))]}
          zoom={6}
          buildings={buildings.map(x => ({ ...x, color: colorToHex(grad(logIt('clamped', clamp(logIt('not clamped', (now - x.created.getTime()) / delta), 0, 1)))) }))}
        />
        {/* { */}
        {/*   buildings.map(x => */}
        {/*     <BuildingMarker */}
        {/*       key={x.page} */}
        {/*       position={[x.lat, x.lng]} */}
        {/*       color={colorToHex(grad(logIt('clamped', clamp(logIt('not clamped', (now - x.created.getTime()) / delta), 0, 1))))} */}
        {/*       onClick={() => setPopupBuilding(x)} */}
        {/*     />) */}
        {/* } */}
        <Cards buildings={buildings} />
        {popupBuilding && <Popup building={popupBuilding} onClose={() => setPopupBuilding(null)} />}
      </div >
    </div >
  )
}
