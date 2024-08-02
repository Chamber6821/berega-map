'use client'

import { useEffect, useState } from "react";
import { Building } from "./api/berega";
import Cards from "./Cards";
import { Map } from "./map";
import Popup from "./Popup";
import FiltersPopup, { Filters } from "./filters/FiltersPopup";
import { useMap } from "./map/Map";
import styled from "styled-components";
import { ArrowBackCircleOutline, ArrowForwardCircleOutline, FilterOutline } from "react-ionicons";
import { LngLat } from "mapbox-gl";
import HelpPopup from "./HelpPopup";

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
  const [showHelpPopup, setShowHelpPopup] = useState(false)
  const [showCards, setShowCards] = useState(false)
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

  useEffect(() => {
    setShowCards(!!selectedArea)
  }, [selectedArea])

  return (
    <div className="root-container">
      <Map
        center={[41.65, 41.65]}
        zoom={12}
        buildings={matchedBuildings}
        onClickInfo={() => setShowHelpPopup(true)}
      />
      <div
        style={{ position: 'relative' }}
      >
        <button
          style={{
            position: 'absolute',
            left: '0',
            top: '50%',
            transform: 'translate(-100%, -50%)'
          }}
          onClick={() => setShowCards(!showCards)}
        >
          {
            showCards
              ? <ArrowForwardCircleOutline
                color={'#00000030'}
                height="50px"
                width="50px"
              />
              : <ArrowBackCircleOutline
                color={'#00000030'}
                height="50px"
                width="50px"
              />
          }
        </button>
        {showCards && <div className="cards__wrapper" >
          <Cards buildings={
            matchedBuildings
              .filter(x => bounds === undefined || bounds.contains(x.location))
              .filter(x => selectedArea === undefined || selectedArea.contains(new LngLat(x.location.lng, x.location.lat)))
          }
          />
        </div>}
      </div>
      <ShowFiltersButton onClick={() => setShowFiltersPopup(!showFiltersPopup)}>
        <FilterOutline />
        Фильтры
      </ShowFiltersButton>
      {popupBuilding && <Popup building={popupBuilding} onClose={() => setPopupBuilding(undefined)} />}
      <FiltersPopup
        visible={showFiltersPopup}
        onClose={x => {
          setShowFiltersPopup(false)
          setFilters(x)
        }} />
      {showHelpPopup && <HelpPopup onClose={() => setShowHelpPopup(false)} />}
    </div>
  )
}
