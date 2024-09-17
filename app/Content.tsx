'use client'

import {useCallback, useEffect, useState} from "react";
import { Building } from "./api/berega";
import Cards from "./Cards";
import { Map } from "./map";
import Popup from "./Popup";
import FiltersPopup from "./filters/FiltersPopup";
import { Bounds, Marker } from "./map/Map";
import styled from "styled-components";
import { CaretBackOutline, CaretForwardOutline, FilterOutline } from "react-ionicons";
import { LngLat, LngLatBounds } from "mapbox-gl";
import HelpPopup from "./HelpPopup";
import FiltersHeader from "./filters/FiltersHeader";
import Polygon from "./map/Polygon";
import { useMarkers } from "./hooks/useMarkers";
import FilterApi from "./filters/FilterApi";
import {fetchBuilding} from "@/app/api/openApi";

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

  const [mapCenter, setMapCenter] = useState<[number, number]>([41.65, 41.65])
  const [zoom, setZoom] = useState(10)

  const { markers, origin } = useMarkers(zoom, mapCenter)

  useEffect(() => { setTimeout(() => setShowPreloader(false), 1000) }, [])

  useEffect(() => setShowCards(!!selectedArea), [selectedArea])
  useEffect(() => selectedArea && setPopupBuildings(undefined), [selectedArea, setPopupBuildings])

  useEffect(() => {
    if (popupBuildings && popupBuildings.length > 1)
      setShowCards(true)
  }, [popupBuildings])

  const handleMarkerSelected = (markers?: Marker[]) => {
  }

  const [buildings, setBuildings] = useState<Building[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreBuildings = useCallback(async () => {
    if (!hasMore || isLoading || !origin.elements.length) return;

    setIsLoading(true);
    const newBuildings = await fetchMoreBuildings(buildings.length);
    setBuildings((prevBuildings) => [...prevBuildings, ...newBuildings]);
    setHasMore(newBuildings.length > 0);
    setIsLoading(false);
  }, [hasMore, isLoading, buildings, origin]);

  const fetchMoreBuildings = async (offset: number): Promise<Building[]> => {
    console.log(origin.type);
    const limit = 10;
    switch(origin.type) {
      case 'Points': {
        const newBuildingIds = origin.elements.slice(offset, offset + limit).map((point) => point.id);
        const newBuildings = await Promise.all(newBuildingIds.map(fetchBuilding));
        return newBuildings;
      }
      case 'Berega': {
        return origin.elements;
      }
      default: {
        return [];
      }
    }
  };

  useEffect(() => {
    setBuildings([]);
    if (origin.elements.length) {
      loadMoreBuildings();
    }
  }, [origin.elements]);

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
          center={mapCenter}
          zoom={zoom}
          markers={markers}
          selectedMarkers={[]}
          onMarkerSelected={handleMarkerSelected}
          onClickInfo={() => setShowHelpPopup(true)}
          onBoundsChanged={setBounds}
          onSelectedAreaChanged={setSelectedArea}
          onMapMove={setMapCenter}
          onZoomChange={setZoom}
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
              buildings={buildings}
              hasMore={hasMore}
              showMore={loadMoreBuildings}
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
