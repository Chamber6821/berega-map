import { fetchFilteredPoints, PointsCountTypeOpenApi, PointsTypeOpenApi } from "../api/openApi"
import { Filters } from "../filters/useFilters"
import { create } from "zustand"

export type PointsStorage = {
  points: PointsTypeOpenApi[],
  updateFor: (filters: Filters, mapCenter: [number, number]) => void
}

export const usePoints = create<PointsStorage>(set => ({
  points: [],
  updateFor: async (filters: Filters, mapCenter: [number, number]) => {
    const points = await fetchFilteredPoints(mapCenter, 100000, filters)
    set({ points })
  }
}))

