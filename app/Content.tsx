'use client'

import { useState } from "react";
import { Building } from "./api/berega";
import Cards from "./Cards";
import { BuildingMarker, Map } from "./map";
import Popup from "./Popup";
import { average, clamp, colorFromHex, colorToHex, gradient, logIt } from "./utils";
import FiltersPopup from "./filters/FiltersPopup";
import { Bounds } from "./map/Map";
import styled from "styled-components";
import { FilterOutline } from "react-ionicons";

const ShowFiltersButton = styled.button`
  display: flex;
  position: absolute;
  top: 10px;
  left: 50px;
  z-index: 2000;
`

const monthAgo = () => {
  const now = new Date()
  now.setMonth(now.getMonth() - 1)
  return now
}

export default function Content({ buildings }:
  { buildings: Building[] }) {
  const [popupBuilding, setPopupBuilding] = useState<Building | null>(null)
  const [showFiltersPopup, setShowFiltersPopup] = useState(false)
  const [bounds, setBounds] = useState<Bounds>()
  const grad = gradient(colorFromHex('#595f58'), colorFromHex('#00ff33'))
  const now = new Date().getTime()
  const timeBound = monthAgo().getTime()
  const delta = now - timeBound
  return (
    <div className="root-container">
      <Map
        center={[41.65, 41.65]}
        zoom={12}
        onBoundsChanged={setBounds}
      >
        {
          buildings.map(x =>
            <BuildingMarker
              key={x.page}
              position={[x.lat, x.lng]}
              color={colorToHex(grad(clamp((now - x.created.getTime() / delta), 0, 1)))}
              onClick={() => setPopupBuilding(x)}
            />)
        }
      </Map>
      <Cards buildings={buildings.filter(x => bounds === undefined || bounds.contains([x.lat, x.lng]))} />
      <ShowFiltersButton onClick={() => setShowFiltersPopup(!showFiltersPopup)}>
        <FilterOutline />
        Фильтры
      </ShowFiltersButton>
      {popupBuilding && <Popup building={popupBuilding} onClose={() => setPopupBuilding(null)} />}
      {showFiltersPopup && <FiltersPopup onClose={() => setShowFiltersPopup(false)} />}
    </div >
  )
}
