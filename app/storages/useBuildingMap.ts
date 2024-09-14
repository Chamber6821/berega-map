import { Building } from "../api/berega";
import { fetchBuilding, PointsTypeOpenApi } from "../api/openApi";
import { create } from 'zustand';

export type BuildingMapStorage = {
  map: { [key: string]: Building },
  forPoint: (point: PointsTypeOpenApi) => Building | undefined,
  loadForPoint: (point: PointsTypeOpenApi) => void,
}

export const useBuildingMap = create<BuildingMapStorage>((set, get) => {
  return {
    map: {},
    forPoint: (point: PointsTypeOpenApi) => get().map[point.id],
    loadForPoint: async (point: PointsTypeOpenApi) => {
      const building = await fetchBuilding(point.id)
      set(x => ({
        map: {
          ...x.map,
          [point.id]: building
        }
      }))
    }
  }
});
