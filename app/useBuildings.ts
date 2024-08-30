import { create } from "zustand"
import { Building, fetchAllBuildings } from "./api/berega"

export type BuildingsStorage = {
  buildings: Building[],
  loadFromBerega: () => void,
}

export const useBuildings = create<BuildingsStorage>(set => ({
  buildings: [],
  loadFromBerega: async () => {
    set({
      buildings: await fetchAllBuildings()
    })
  },
}))
