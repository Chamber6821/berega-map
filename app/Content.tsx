'use client'

import { useEffect, useState } from "react";
import { Building } from "./api/berega";
import Cards from "./Cards";
import { Map } from "./map";
import Popup from "./Popup";
import FiltersPopup from "./filters/FiltersPopup";
import styled from "styled-components";
import { CaretBackOutline, CaretForwardOutline, FilterOutline } from "react-ionicons";
import { LngLat, LngLatBounds } from "mapbox-gl";
import HelpPopup from "./HelpPopup";
import FiltersHeader from "./filters/FiltersHeader";
import { OriginType, useMarkers } from "./hooks/useMarkers";
import { Bounds, Marker } from "./map/Map";
import { useBuildingMap } from "./storages/useBuildingMap";
import Polygon from "./map/Polygon";
import FilterApi from "./filters/FilterApi";
import useAssistant from "./hooks/useAssistant";
import AssistantChat from "./components/chat/AssitantChat";

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

const buildingsForMarkers = async (origin: OriginType, markers: Marker[]) => {
  switch (origin.type) {
    case "Berega": {
      const pages = markers.map(x => x.id)
      return origin.elements.filter(x => pages.includes(x.page))
    }
    case "Points": {
      const { forPoint } = useBuildingMap.getState()
      return await Promise.all(markers.map(x => forPoint(x.id)))
    }
    case "Clusters": return []
  }
}

export default function Content() {
  const [showFiltersPopup, setShowFiltersPopup] = useState(false)
  const [showHelpPopup, setShowHelpPopup] = useState(false)
  const [showCards, setShowCards] = useState(false)
  const [showPreloader, setShowPreloader] = useState(true)

  const [bounds, setBounds] = useState<Bounds>(new LngLatBounds())
  const [selectedArea, setSelectedArea] = useState<Polygon>()

  const [mapCenter, setMapCenter] = useState<[number, number]>([41.65, 41.65])
  const [zoom, setZoom] = useState(10)

  const { markers, origin } = useMarkers(zoom, mapCenter)

  const [popupBuildings, setPopupBuildings] = useState<Building[]>()
  const [selectedMarkers, setSelectedMarkers] = useState<Marker[]>([])

  const [buildings, setBuildings] = useState<Building[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const assistant = useAssistant()

  const filteredBuildings = selectedArea
    ? buildings.filter(building => {
      const point = new LngLat(building.location.lng, building.location.lat)
      return selectedArea.contains(point)
    })
    : buildings

  const handleMarkerSelected = (markers?: Marker[]) => {
    if (origin.type === 'Clusters' && markers) {
      const cluster = markers[0]
      setZoom(11)
      setMapCenter([cluster.longitude, cluster.latitude])
      return
    }
    if (!selectedMarkers || !markers) {
      setSelectedMarkers(markers || [])
      return
    }
    const currentIds = JSON.stringify(selectedMarkers.map(x => x.id).sort())
    const newIds = JSON.stringify(markers.map(x => x.id).sort())
    setSelectedMarkers(newIds === currentIds ? [] : markers)
  }

  const fetchMoreBuildings = async (offset: number): Promise<Building[]> => {
    const limit = 10
    switch (origin.type) {
      case 'Points': {
        const { forPoint } = useBuildingMap.getState?.()
        const newPoints = origin.elements.slice(offset, offset + limit)
        return await Promise.all(
          newPoints.map(async point => await forPoint(point.id))
        )
      }
      case 'Berega': {
        return origin.elements.slice(offset, offset + limit)
      }
      default: {
        return []
      }
    }
  }

  const loadMoreBuildings = async () => {
    if (!hasMore || isLoading || origin.elements.length === 0) return
    setIsLoading(true)
    try {
      const newBuildings = await fetchMoreBuildings(buildings.length)
      setBuildings((prevBuildings) => [...prevBuildings, ...newBuildings])
      const newOffset = buildings.length + newBuildings.length
      setHasMore(newOffset < origin.elements.length)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    (async () => {
      setPopupBuildings(await buildingsForMarkers(origin, selectedMarkers))
    })()
  }, [selectedMarkers])

  useEffect(() => {
    setSelectedMarkers([])
  }, [markers.length])

  useEffect(() => { setTimeout(() => setShowPreloader(false), 1000) }, [])

  useEffect(() => setShowCards(!!selectedArea), [selectedArea])
  useEffect(() => selectedArea && setPopupBuildings(undefined), [selectedArea, setPopupBuildings])

  useEffect(() => {
    if (popupBuildings && popupBuildings.length > 1)
      setShowCards(true)
  }, [popupBuildings])

  useEffect(() => {
    setBuildings([])
    if (origin.elements.length > 0) {
      setHasMore(true)
      loadMoreBuildings()
    }
  }, [origin.elements, origin.type])

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
          selectedMarkers={selectedMarkers}
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
            {
              popupBuildings
                ? <Cards
                  buildings={popupBuildings}
                  hasMore={false}
                  showMore={() => { }}
                />
                : <Cards
                  buildings={filteredBuildings}
                  hasMore={hasMore}
                  showMore={loadMoreBuildings}
                />
            }
          </div>}
        </div>
      </MapAndCards>
      {showFiltersPopup && <FiltersPopup onClose={() => setShowFiltersPopup(false)} />}
      {
        popupBuildings && popupBuildings.length === 1
        && <Popup
          building={popupBuildings[0]}
          onClose={() => setSelectedMarkers([])}
        />
      }
      {showHelpPopup && <HelpPopup onClose={() => setShowHelpPopup(false)} />}
      <AssistantChat assistant={assistant} />
    </div>
  )
}
