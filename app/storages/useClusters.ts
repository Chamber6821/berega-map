import { PointsCountTypeOpenApi } from "../api/openApi"
import { Filters } from "../filters/useFilters"

export type ClustersStorage = {
  clusters: PointsCountTypeOpenApi[],
  firstLoad: (filters: Filters) => void
}

