'use client'

import { useState } from "react";
import { Building } from "./api/berega";
import Cards from "./Cards";
import { Map } from "./map";
import Popup from "./Popup";
import { clamp, colorFromHex, colorToHex, gradient } from "./utils";
import FiltersPopup from "./filters/FiltersPopup";
import { Bounds, useMap } from "./map/Map";
import styled from "styled-components";
import { FilterOutline } from "react-ionicons";
import { LngLat } from "mapbox-gl";

const ShowFiltersButton = styled.button`
  display: flex;
  align-items: center;
  position: absolute;
  height: 40px;
  padding: 0 10px;
  background: #fff;
  border-radius: 8px;
  top: 10px;
  left: 10px;
  z-index: 2000;
  transition: background 0.2s;

  @media(hover: hover){
  &:hover{
      background: #f0f1f5;
     }
  }
`

const monthAgo = () => {
  const now = new Date()
  now.setMonth(now.getMonth() - 1)
  return now
}

export default function Content({ buildings }:
  { buildings: Building[] }) {
  const popupBuilding = useMap(x => x.selectedBuilding)
  const setPopupBuilding = useMap(x => x.setSelectedBuilding)
  const [showFiltersPopup, setShowFiltersPopup] = useState(false)
  const bounds = useMap(x => x.bounds)
  const selectedArea = useMap(x => x.selectedArea)
  const grad = gradient(colorFromHex('#808080'), colorFromHex('#009c1a'))
  const now = new Date().getTime()
  const timeBound = monthAgo().getTime()
  const delta = now - timeBound
  return (
    <div className="root-container">
      <Map
        center={[41.65, 41.65]}
        zoom={12}
        buildings={buildings.map(x => ({ ...x, color: colorToHex(grad(clamp((now - x.created.getTime()) / delta, 0, 1))) }))}
      />
      <div className="cards__wrapper">
      <Cards buildings={
        buildings
          .filter(x => bounds === undefined || bounds.contains(x))
          .filter(x => selectedArea === undefined || selectedArea.contains(new LngLat(x.lng, x.lat)))
      }
      />
      </div>
      <ShowFiltersButton onClick={() => setShowFiltersPopup(!showFiltersPopup)}>
        <FilterOutline />
        Фильтры
      </ShowFiltersButton>
      {popupBuilding && <Popup building={popupBuilding} onClose={() => setPopupBuilding(undefined)} />}
      {showFiltersPopup && <FiltersPopup onClose={() => setShowFiltersPopup(false)} />}
    </div>
  )
}
