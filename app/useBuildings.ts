import { create } from "zustand"
import { Building } from "./api/berega"

export type BuildingsStorage = {
    buildings: Building[],
    loadFromBerega: () => void,
}

export const useBuildings = create<BuildingsStorage>(set => ({
    buildings: [],
    loadFromBerega: () => { throw new Error("useBuildings().loadFromBerega not initialized on server") },
}))