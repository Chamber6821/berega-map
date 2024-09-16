'use client'

import { useMemo, useEffect } from "react"
import { Building } from "../api/berega"
import { PointsTypeOpenApi, PointsCountTypeOpenApi } from "../api/openApi"
import { FilterGroup, FilterApi, useFilters, filterOf } from "../filters/useFilters"
import { Marker } from "../map/Map"
import { useBuildings } from "../storages/useBuildings"
import { useClusters } from "../storages/useClusters"
import { usePoints } from "../storages/usePoints"

const colorMap: Record<FilterGroup, string> = {
  'Новостройки': '#df11ff',
  'Вторичное жилье': '#0000ff',
  'Дома, коттеджи': '#ff0000',
  'Зем. участки': '#994009',
  'Коммерческая': '#ffa640',
} as const

const originType = (zoom: number, api: FilterApi) => api === 'Встроенное'
  ? 'Berega'
  : zoom >= 11
    ? 'Points'
    : 'Clusters'

export const useMarkers = (zoom: number, mapCenter: [number, number]): {
  markers: Marker[]
  origin: {
    type: 'Berega'
    elements: Building[]
  } | {
    type: 'Points'
    elements: PointsTypeOpenApi[]
  } | {
    type: 'Clusters'
    elements: PointsCountTypeOpenApi[]
  }
} => {
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
  const clusterMarkers = useMemo(() => clusters.map((x): Marker => ({
    id: `cluster-${x.longitude}-${x.latitude}`,
    latitude: x.latitude,
    longitude: x.longitude,
    color: colorMap[x.houseStatus],
    radius: 10
  })), [clusters])
  const updateClusters = useClusters(x => x.updateFor)

  const buildings = useBuildings(x => x.buildings)
  const beregaMarkers = useMemo(() => buildings.map((x): Marker => ({
    id: x.page,
    latitude: x.location.lat,
    longitude: x.location.lng,
    color: colorMap[x.group],
    radius: 5
  })), [buildings])
  const updateBeregaBuildings = useBuildings(x => x.loadFromBerega)

  useEffect(() => {
    filters.api === 'Внешнее' && zoom >= 11 && updatePoints(filters, mapCenter)
  }, [updatePoints, filters, mapCenter, zoom])

  useEffect(() => {
    filters.api === 'Внешнее' && updateClusters(filters)
  }, [updateClusters, filters])

  useEffect(() => {
    filters.api === 'Встроенное' && updateBeregaBuildings(filterOf(filters))
  }, [updateBeregaBuildings, filters])

  switch (originType(zoom, filters.api)) {
    case "Berega": return {
      markers: beregaMarkers,
      origin: { type: 'Berega', elements: buildings }
    }
    case "Points": return {
      markers: parserMarkers,
      origin: { type: 'Points', elements: points }
    }
    case "Clusters": return {
      markers: clusterMarkers,
      origin: { type: 'Clusters', elements: clusters }
    }
  }
}

