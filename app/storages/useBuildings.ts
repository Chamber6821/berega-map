import { create } from "zustand";
import { Building } from "../api/berega";

export type BuildingsStorage = {
  buildings: Building[],
  loadFromBerega: (filter: (x: Building) => boolean) => void,
};

export const useBuildings = create<BuildingsStorage>((set, get) => {
  const ITEMS_PER_BATCH = 10;
  let loadedBuildingCount = 0;
  let loadedPointsCount = 0;

  return {
    buildings: [],
    loadedBuildingsFromPoints: [],
    hasMore: true,
    loadFromBerega: () => { throw new Error("useBuildings().loadFromBerega not initialized on server") },
    loadMoreItems: async (buildings, points) => {
      const nextBuildings = buildings.slice(
        loadedBuildingCount,
        loadedBuildingCount + ITEMS_PER_BATCH
      );
      const nextPoints = points.slice(
        loadedPointsCount,
        loadedPointsCount + ITEMS_PER_BATCH
      );
      const nextLoadedBuildings = await Promise.all(
        nextPoints.map((point) => fetchBuilding(point.id))
      );
      set((state) => ({
        buildings: [...state.buildings, ...nextBuildings],
        loadedBuildingsFromPoints: [...state.loadedBuildingsFromPoints, ...nextLoadedBuildings],
        hasMore: nextBuildings.length > 0 || nextLoadedBuildings.length > 0,
      }));
      loadedBuildingCount += nextBuildings.length;
      loadedPointsCount += nextPoints.length;
    },
  };
});
