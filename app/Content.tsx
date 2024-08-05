'use client'

import { useEffect, useState } from "react";
import { Building } from "./api/berega";
import Cards from "./Cards";
import { Map } from "./map";
import Popup from "./Popup";
import FiltersPopup, { Filters } from "./filters/FiltersPopup";
import { useMap } from "./map/Map";
import styled from "styled-components";
import { CaretBackOutline, CaretForwardOutline, FilterOutline } from "react-ionicons";
import { LngLat } from "mapbox-gl";
import HelpPopup from "./HelpPopup";
import FiltersHeader from "./filters/FiltersHeader";

const ShowFiltersButton = styled.button`
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 10px;
  background: rgb(0, 156, 26);
  border-radius: 10px;
  color: #fff;
  z-index: 2000;
  transition: background 0.2s;
  font-weight: 500;

  @media(hover: hover){
  &:hover{
      background-color: rgb(171, 207, 177);
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
    <div style={{
      display: 'flex',
      width: '100%',
      height: '100%',
      flexDirection: 'column',
      position: 'relative',
    }}>
      <div className="filter__wrapper" style={{
        display: 'flex',
        flexDirection: 'row',
      }}>
        <FiltersHeader />
        <ShowFiltersButton onClick={() => setShowFiltersPopup(!showFiltersPopup)}>
          <FilterOutline
            color={'#00000'} />
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
        <button className="list__btn"
            style={{
              position: 'absolute',
              left: '0',
              top: '50%',
              transform: 'translate(-100%, -50%)',
              padding: '10px 5px',
              background: 'rgb(0, 156, 26)',
              borderTopLeftRadius: '10px',
              borderBottomLeftRadius: '10px',
            }}
            onClick={() => setShowCards(!showCards)}
          >
            {
              showCards
                ? <CaretForwardOutline
                  color={'#ffffff'}
                  height="30px"
                  width="30px"
                />
                : <CaretBackOutline
                  color={'#ffffff'}
                  height="30px"
                  width="30px"
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
      <FiltersPopup
        visible={showFiltersPopup}
        onClose={x => {
          setShowFiltersPopup(false)
          setFilters(x)
        }} />
      {popupBuilding && <Popup building={popupBuilding} onClose={() => setPopupBuilding(undefined)} />}
      {showHelpPopup && <HelpPopup onClose={() => setShowHelpPopup(false)} />}
    </div>
  )
}
