'use client'

import { useEffect, useMemo, useState } from "react";
import { Building } from "./api/berega";
import Cards from "./Cards";
import { Map } from "./map";
import Popup from "./Popup";
import FiltersPopup from "./filters/FiltersPopup";
import { Bounds, Marker, MarkerId } from "./map/Map";
import styled from "styled-components";
import { CaretBackOutline, CaretForwardOutline, FilterOutline } from "react-ionicons";
import { LngLat, LngLatBounds } from "mapbox-gl";
import HelpPopup from "./HelpPopup";
import FiltersHeader from "./filters/FiltersHeader";
import FilterApi from "./filters/FilterApi";
import { FilterGroup, filterOf, useFilters } from "./filters/useFilters";
import { useBuildings } from "./storages/useBuildings";
import { useClusters } from './storages/useClusters';
import { usePoints } from "./storages/usePoints";
import Polygon from "./map/Polygon";
import MapWithMarkers from "./map/MapWithMarkers";

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

const ShowCardsButton = styled.button`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translate(-100%, -50%);
  padding: 10px 5px;
  background: rgb(0, 156, 26);
  border-radius: 10px 0 0 10px;

  @media (max-width: 720px) {
    & {
      top: 0;
      transform: translateY(-100%);
      padding: 5px 10px;
      border-radius: 10px 10px 0 0;
    }

    & > * {
      transform: rotate(90deg);
    }
  }
`

const MapAndCards = styled.div`
  flex-grow: 1;
  display: flex;
  width: 100%;
  overflow: auto;
  position: relative;

  @media (max-width: 720px) {
    & {
      flex-direction: column;
    }
  }
`

export default function Content() {
  const [showFiltersPopup, setShowFiltersPopup] = useState(false)
  const [showHelpPopup, setShowHelpPopup] = useState(false)
  const [showCards, setShowCards] = useState(false)
  const [showPreloader, setShowPreloader] = useState(true)

  const [popupBuildings, setPopupBuildings] = useState<Building[]>()

  const [bounds, setBounds] = useState<Bounds>(new LngLatBounds())
  const [selectedArea, setSelectedArea] = useState<Polygon>()

  useEffect(() => { setTimeout(() => setShowPreloader(false), 1000) }, [])

  useEffect(() => setShowCards(!!selectedArea), [selectedArea])
  useEffect(() => selectedArea && setPopupBuildings(undefined), [selectedArea, setPopupBuildings])

  useEffect(() => {
    if (popupBuildings && popupBuildings.length > 1)
      setShowCards(true)
  }, [popupBuildings])

  const handleMarkerSelected = (ids: MarkerId[]) => {
  }

  return (
    <div style={{
      display: 'flex',
      width: '100dvw',
      height: '100dvh',
      flexDirection: 'column',
      position: 'relative',
    }}>
      {showPreloader && <div className="preloader"></div>}
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
      <FilterApi />
      <MapAndCards>
        <MapWithMarkers
          onClickInfo={() => setShowHelpPopup(true)}
          onBoundsChanged={setBounds}
          onSelectedAreaChanged={setSelectedArea}
          onMarkerSelected={handleMarkerSelected}
        />
        <div
          style={{ position: 'relative' }}
        >
          <ShowCardsButton onClick={() => setShowCards(!showCards)}>
            <div>
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
            </div>
          </ShowCardsButton>
          {showCards && <div className="cards__wrapper" >
            <Cards
              buildings={
                popupBuilding && popupBuilding.length > 1
                  ? popupBuilding
                  : matchedBuildings
                    .filter(x => bounds === undefined || bounds.contains(x.location))
                    .filter(x => selectedArea === undefined || selectedArea.contains(new LngLat(x.location.lng, x.location.lat)))
              }
              points={points.filter(x => selectedArea === undefined || selectedArea.contains(new LngLat(x.longitude, x.latitude)))}
            />
          </div>}
        </div>
      </MapAndCards>
      {showFiltersPopup && <FiltersPopup onClose={() => setShowFiltersPopup(false)} />}
      {
        popupBuildings && popupBuildings.length === 1
        && <Popup
          building={popupBuildings[0]}
          onClose={() => setPopupBuildings(undefined)}
        />
      }
      {showHelpPopup && <HelpPopup onClose={() => setShowHelpPopup(false)} />}
    </div>
  )
}
