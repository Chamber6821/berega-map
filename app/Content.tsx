'use client'

import { useCallback, useEffect, useMemo, useState } from "react";
import { Building, fetchAllBuildings } from "./api/berega";
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
import FilterApi from "./filters/FilterApi";
import { filterOf, useFilters } from "./filters/useFilters";
import { fetchFilteredPoints, fetchPointsCounter, PointsCountTypeOpenApi, PointsTypeOpenApi } from "./api/openApi";
import { useBuildings } from "./storages/useBuildings";
import { useClusters } from './storages/useClusters';

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
  const popupBuilding = useMap(x => x.selectedBuilding)
  const setPopupBuilding = useMap(x => x.setSelectedBuilding)
  const setPoputBuildingFromPoints = useMap(x => x.setSelectedPointId)
  const bounds = useMap(x => x.bounds)
  const selectedArea = useMap(x => x.selectedArea)
  const [mapCenter, setMapCenter] = useState<[number, number]>([41.65, 41.65]);
  const [zoom, setZoom] = useState(10);
  const [points, setPoints] = useState<PointsTypeOpenApi[]>([]);
  const [pointsCounter, setPointsCounter] = useState<PointsCountTypeOpenApi[]>([]);

  const buildings = useBuildings(x => x.buildings)
  const pointsFromBuildings = useMemo(() =>
    buildings.map((x): PointsTypeOpenApi => ({
      id: x.page,
      latitude: x.location.lat,
      longitude: x.location.lng,
      houseStatus: x.group
    })), [buildings])
  const load = useBuildings(x => x.loadFromBerega)
  const filters = useFilters()
  useEffect(() => load(filterOf(filters)), [load, filters])

  useEffect(() => { setTimeout(() => setShowPreloader(false), 1000) }, [])

  useEffect(() => setShowCards(!!selectedArea), [selectedArea])
  useEffect(() => selectedArea && setPopupBuilding(undefined), [selectedArea, setPopupBuilding])

  useEffect(() => {
    if (popupBuilding && popupBuilding.length > 1)
      setShowCards(true)
  }, [popupBuilding])

  useEffect(() => {
    filters.api === 'Внешнее' && zoom >= 11 && (async () => {
      setPoints(await fetchFilteredPoints(mapCenter, 100000, filters));
    })()
  }, [filters, mapCenter, zoom]);

  useEffect(() => {
    filters.api === 'Внешнее' && (async () =>
      setPointsCounter(await fetchPointsCounter(filters)))()
  }, [filters]);

  const handleMapMove = useCallback((center: [number, number]) => {
    setMapCenter(center);
  }, []);

  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom);
  };

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
        <Map
          center={[41.65, 41.65]}
          zoom={zoom}
          buildings={pointsFromBuildings}
          clusters={pointsCounter}
          onClickInfo={() => setShowHelpPopup(true)}
          onMapMove={handleMapMove}
          onZoomChange={handleZoomChange}
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
      {popupBuilding && popupBuilding.length === 1 && <Popup building={popupBuilding[0]} onClose={() => { setPopupBuilding(undefined); setPoputBuildingFromPoints(undefined) }} />}
      {showHelpPopup && <HelpPopup onClose={() => setShowHelpPopup(false)} />}
    </div >
  )
}
