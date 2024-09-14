import { Building } from "../api/berega";
import { PointsTypeOpenApi } from "../api/openApi";
import { create } from 'zustand';

export type BuildignMapStorage = {
  map: { [key: number]: Building },
  forPoint: (point: PointsTypeOpenApi) => Building | undefined,
  loadForPoint: (point: PointsTypeOpenApi) => void,
}

export const useBuildingMap = create<BuildignMapStorage>((set, get) => {
  return {
    map: ,
    forPoint: async (point: PointsTypeOpenApi) => {

    },
    loadForPoint: (point: PointsTypeOpenApi) => {

    }
  }
});