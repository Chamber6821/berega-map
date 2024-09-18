import { create } from "zustand";
import { Building } from "../api/berega";

export type BuildingsStorage = {
  buildings: Building[],
  loadFromBerega: (filter: (x: Building) => boolean) => void,
};

export const useBuildings = create<BuildingsStorage>(() => ({
  buildings: [],
  loadFromBerega: () => { throw new Error("useBuildings().loadFromBerega not initialized on server") }
}))
