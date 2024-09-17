import { Building } from "../api/berega";
import { fetchBuilding, PointsTypeOpenApi } from "../api/openApi";
import { create } from 'zustand';

export type BuildingMapStorage = {
  map: { [key: string]: Building },
  forPoint: (point: PointsTypeOpenApi) => Promise<Building>,
}

export const useBuildingMap = create<BuildingMapStorage>((set, get) => ({
  map: {},
  forPoint: async (point: PointsTypeOpenApi) => {
    const cached = get().map[point.id]
    if (cached) return cached
    const building = await fetchBuilding(point.id)
    set(x => ({
      map: {
        ...x.map,
        [point.id]: building
      }
    }))
    return building
  }
}))
