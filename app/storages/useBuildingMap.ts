import { Building } from "../api/berega";
import { fetchBuilding, PointsTypeOpenApi } from "../api/openApi";
import { create } from 'zustand';

export type BuildingMapStorage = {
  map: { [key: string]: Building },
  forPoint: (point: PointsTypeOpenApi) => Promise<Building>,
}

export const useBuildingMap = create<BuildingMapStorage>((set, get) => ({
  map: {},
  forPoint: async (id: string) => {
    const cached = get().map[id]
    if (cached) return cached
    const building = await fetchBuilding(id)
    set(x => ({
      map: {
        ...x.map,
        [id]: building
      }
    }))
    return building
  }
}))
