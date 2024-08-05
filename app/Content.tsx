'use client'

import { useEffect, useState } from "react";
import { Building } from "./api/berega";
import Cards from "./Cards";
import { Map } from "./map";
import Popup from "./Popup";
import FiltersPopup from "./filters/FiltersPopup";
import { useMap } from "./map/Map";
import styled from "styled-components";
import { CaretBackOutline, CaretForwardOutline, FilterOutline } from "react-ionicons";
import { LngLat } from "mapbox-gl";
import HelpPopup from "./HelpPopup";
import FiltersHeader from "./filters/FiltersHeader";
import { filterOf, useFilters } from "./filters/useFilters";

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
  const popupBuilding = useMap(x => x.selectedBuilding)
  const setPopupBuilding = useMap(x => x.setSelectedBuilding)
  const bounds = useMap(x => x.bounds)
  const selectedArea = useMap(x => x.selectedArea)
  const filters = useFilters()
  const matchedBuildings = buildings.filter(filterOf(filters))

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
      {showFiltersPopup && <FiltersPopup onClose={() => setShowFiltersPopup(false)} />}
      {popupBuilding && <Popup building={popupBuilding} onClose={() => setPopupBuilding(undefined)} />}
      {showHelpPopup && <HelpPopup onClose={() => setShowHelpPopup(false)} />}
    </div>
  )
}
