import { useState } from "react"
import { Polygon, Polyline, useMapEvents } from "react-leaflet"
import { create } from "zustand"

export interface SelectionAreaType {
  polygon: [number, number][]
  set(points: [number, number][]): void
}

export const useSelectionArea = create<SelectionAreaType>((set) => ({
  polygon: [],
  set: (points) => set({ polygon: points })
}))

export default function SelectionArea() {
  const selectionArea = useSelectionArea()
  const [points, setPoints] = useState<[number, number][]>([])
  const [drawMode, setDrawMode] = useState(false)
  useMapEvents({
    mousedown() {
      setDrawMode(true)
    },
    mousemove(e) {
      if (drawMode) {
        setPoints([...points, [e.latlng.lat, e.latlng.lng]])
      }
    },
    mouseup() {
      setDrawMode(false)
      setPoints([])
      selectionArea.set(points)
    }
  })
  return <>
    <Polyline positions={points} />
    <Polygon positions={selectionArea.polygon} />
  </>
}
