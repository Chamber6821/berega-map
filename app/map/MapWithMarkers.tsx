import { useEffect, useMemo, useState } from "react";
import Map, { Bounds, Marker, MarkerId } from "./Map";
import Polygon from "./Polygon";
import { FilterGroup, filterOf, useFilters } from "../filters/useFilters";
import { usePoints } from "../storages/usePoints";
import { useClusters } from "../storages/useClusters";
import { useBuildings } from "../storages/useBuildings";

const colorMap: Record<FilterGroup, string> = {
  'Новостройки': '#df11ff',
  'Вторичное жилье': '#0000ff',
  'Дома, коттеджи': '#ff0000',
  'Зем. участки': '#994009',
  'Коммерческая': '#ffa640',
} as const

export default function MapWithMarkers(props: {
  selectedMarkers: Marker[],
  onMarkerSelected: (markers?: Marker[]) => void
  onClickInfo: () => void,
  onBoundsChanged: (bounds: Bounds) => void,
  onSelectedAreaChanged: (area?: Polygon) => void,
}) {
  const [mapCenter, setMapCenter] = useState<[number, number]>([41.65, 41.65])
  const [zoom, setZoom] = useState(10)

  const filters = useFilters()

  const points = usePoints(x => x.points)
  const parserMarkers = points.map((x): Marker => ({
    id: x.id,
    latitude: x.latitude,
    longitude: x.longitude,
    color: colorMap[x.houseStatus],
    radius: 5
  }))
  const updatePoints = usePoints(x => x.updateFor)

  const clusters = useClusters(x => x.clusters)
  const clusterMarkers = useMemo(() =>
    clusters.map((x): Marker => ({
      id: `cluster-${x.longitude}-${x.latitude}`,
      latitude: x.latitude,
      longitude: x.longitude,
      color: colorMap[x.houseStatus],
      radius: 10
    })), [clusters])
  const updateClusters = useClusters(x => x.updateFor)

  const buildings = useBuildings(x => x.buildings)
  const beregaMarkers = useMemo(() =>
    buildings.map((x): Marker => ({
      id: x.page,
      latitude: x.location.lat,
      longitude: x.location.lng,
      color: colorMap[x.group],
      radius: 5
    })), [buildings])
  const updateBeregaBuildings = useBuildings(x => x.loadFromBerega)

  useEffect(() => {
    filters.api === 'Внешнее' && zoom >= 11 && updatePoints(filters, mapCenter)
  }, [updatePoints, filters, mapCenter, zoom]);

  useEffect(() => {
    filters.api === 'Внешнее' && updateClusters(filters)
  }, [updateClusters, filters]);

  useEffect(() => {
    filters.api === 'Встроенное' && updateBeregaBuildings(filterOf(filters))
  }, [updateBeregaBuildings, filters])

  const markers =
    filters.api === 'Встроенное'
      ? beregaMarkers
      : zoom >= 11
        ? parserMarkers
        : clusterMarkers

  return <Map
    center={mapCenter}
    zoom={zoom}
    markers={markers}
    selectedMarkers={props.selectedMarkers}
    onClickInfo={props.onClickInfo}
    onMapMove={setMapCenter}
    onZoomChange={setZoom}
    onBoundsChanged={props.onBoundsChanged}
    onSelectedAreaChanged={props.onSelectedAreaChanged}
    onMarkerSelected={props.onMarkerSelected}
  />
}
