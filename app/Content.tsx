'use client'

import { useState } from "react";
import { Building } from "./api/berega";
import Cards from "./Cards";
import { Map } from "./map";
import Popup from "./Popup";
import FiltersPopup, { Filters } from "./filters/FiltersPopup";
import { useMap } from "./map/Map";
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

export default function Content({ buildings }:
  { buildings: Building[] }) {
  const [showFiltersPopup, setShowFiltersPopup] = useState(false)
  const [filters, setFilters] = useState<Filters>({})
  const popupBuilding = useMap(x => x.selectedBuilding)
  const setPopupBuilding = useMap(x => x.setSelectedBuilding)
  const bounds = useMap(x => x.bounds)
  const selectedArea = useMap(x => x.selectedArea)
  const matchByVariants = (variants: string[] | undefined, value: string) => !variants || variants.includes(value)
  const matchByRange = (min: number | undefined, max: number | undefined, value: number) =>
    (min === undefined || min <= value)
    && (max === undefined || value <= max)
  const match = (x: Building) =>
    matchByVariants(filters.types, x.type)
    // && matchByVariants(filters.rooms, x.rooms)
    // && matchByVariants(filters.status, x.status)
    && matchByVariants(filters.frame, x.frame)
    // && filters.country === x.country
    // && filters.city === x.city
    && matchByRange(filters.priceFrom, filters.priceTo, x.price)
    && matchByRange(filters.floorFrom, filters.floorTo, x.floor)
    && matchByRange(filters.areaFrom, filters.areaTo, x.area)
  const matchedBuildings = buildings.filter(match)
  return (
    <div className="root-container">
      <Map
        center={[41.65, 41.65]}
        zoom={12}
        buildings={matchedBuildings}
      />
      <div className="cards__wrapper">
        <Cards buildings={
          matchedBuildings
            .filter(x => bounds === undefined || bounds.contains(x.location))
            .filter(x => selectedArea === undefined || selectedArea.contains(new LngLat(x.location.lng, x.location.lat)))
        }
        />
      </div>
      <ShowFiltersButton onClick={() => setShowFiltersPopup(!showFiltersPopup)}>
        <FilterOutline />
        Фильтры
      </ShowFiltersButton>
      {popupBuilding && <Popup building={popupBuilding} onClose={() => setPopupBuilding(undefined)} />}
      {showFiltersPopup && <FiltersPopup onClose={x => {
        setShowFiltersPopup(false)
        setFilters(x)
      }} />}
    </div>
  )
}
