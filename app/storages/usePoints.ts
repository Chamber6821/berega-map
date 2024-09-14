import {fetchFilteredPoints, PointsCountTypeOpenApi, PointsTypeOpenApi} from "../api/openApi"
import { Filters } from "../filters/useFilters"
import { create } from "zustand"

export type PointsStorage = {
  points: PointsTypeOpenApi[],
  filters: Filters,
  load: (filters: Filters, mapCenter: [number, number]) => void
}

export const usePoints = create<PointsStorage>((set, get) => {
  return {
    points: [],
    filters: {},
    firstLoad: (filters: Filters, mapCenter: [number, number]) => {
      set(async (state) => ({
        points: await fetchFilteredPoints(mapCenter, 100000, filters)
      }));
    }
  }
});

