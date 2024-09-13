import { PointsCountTypeOpenApi } from "../api/openApi"
import { Filters } from "../filters/useFilters"

export type PointsStorage = {
  points: PointsCountTypeOpenApi[],
  hasMore: boolean,
  filters: Filters,
  firstLoad: (filters: Filters, mapCenter: [number, number]) => void,
  loadMore: () => void
}

