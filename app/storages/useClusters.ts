import { fetchPointsCounter, PointsCountTypeOpenApi } from "../api/openApi"
import { Filters } from "../filters/useFilters"
import { create } from "zustand";

export type ClustersStorage = {
  clusters: PointsCountTypeOpenApi[],
  updateFor: (filters: Filters) => void
}

export const useClusters = create<ClustersStorage>(set => ({
  clusters: [],
  updateFor: async (filters: Filters) => {
    const clusters = await fetchPointsCounter(filters)
    set({ clusters })
  }
}))
