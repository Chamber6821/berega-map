'use client'

import { useEffect, useState } from "react";
import { Building } from "./api/berega";
import Cards from "./Cards";
import { Map } from "./map";
import Popup from "./Popup";
import FiltersPopup from "./filters/FiltersPopup";
import { useMap } from "./map/Map";
import styled from "styled-components";
import { ArrowBackCircleOutline, ArrowForwardCircleOutline, FilterOutline } from "react-ionicons";
import { LngLat } from "mapbox-gl";
import HelpPopup from "./HelpPopup";
import FiltersHeader from "./filters/FiltersHeader";
import { Range, useFilters } from "./filters/useFilters";

const ShowFiltersButton = styled.button`
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 10px;
  background: #fff;
  border-radius: 8px;
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
  const popupBuilding = useMap(x => x.selectedBuilding)
  const setPopupBuilding = useMap(x => x.setSelectedBuilding)
  const bounds = useMap(x => x.bounds)
  const selectedArea = useMap(x => x.selectedArea)
  const filters = useFilters()
  const matchByVariants = (variants: string[], value: string) => variants.length === 0 || variants.includes(value)
  const matchByRange = (range: Range, value: number) =>
    (range[0] === undefined || range[0] <= value)
    && (range[1] === undefined || value <= range[1])
  const match = (x: Building) =>
    matchByVariants(filters.types, x.type)
    // && matchByVariants(filters.rooms, x.rooms)
    // && matchByVariants(filters.status, x.status)
    && matchByVariants(filters.frame, x.frame)
    // && filters.country === x.country
    // && filters.city === x.city
    && matchByRange(filters.priceRange, x.price)
    && matchByRange(filters.floorRange, x.floor)
    && matchByRange(filters.areaRange, x.area)
  const matchedBuildings = buildings.filter(match)

  useEffect(() => {
    setShowCards(!!selectedArea)
  }, [selectedArea])

  return (
    <div style={{
      display: 'flex',
      width: '100%',
      height: '100%',
      flexDirection: 'column',
      position: 'relative',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
      }}>
        <FiltersHeader />
        <ShowFiltersButton onClick={() => setShowFiltersPopup(!showFiltersPopup)}>
          <FilterOutline />
          Фильтры
        </ShowFiltersButton>
      </div>
      <div
        className="root-container"
        style={{
          flexShrink: 0
        }}
      >
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
      </div>
      {showFiltersPopup && <FiltersPopup onClose={() => setShowFiltersPopup(false)} />}
      {popupBuilding && <Popup building={popupBuilding} onClose={() => setPopupBuilding(undefined)} />}
      {showHelpPopup && <HelpPopup onClose={() => setShowHelpPopup(false)} />}
    </div>
  )
}
