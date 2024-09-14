import {fetchPointsCounter, PointsCountTypeOpenApi} from "../api/openApi"
import { Filters } from "../filters/useFilters"
import { create } from "zustand";

export type ClustersStorage = {
  clusters: PointsCountTypeOpenApi[],
  load: (filters: Filters) => void
}

export const useClusters = create<ClustersStorage>((set, get) => {
  return {
    clusters: [],
    firstLoad: (filters: Filters) => {
      set(async (state) => ({
        clusters: await fetchPointsCounter(filters)
      }));
    }
  }
});