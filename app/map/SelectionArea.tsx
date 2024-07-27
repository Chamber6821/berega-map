import { useState } from "react"
import { create } from "zustand"

export interface SelectionAreaType {
  polygon: [number, number][]
  set(points: [number, number][]): void
}

export const useSelectionArea = create<SelectionAreaType>((set) => ({
  polygon: [],
  set: (points) => set({ polygon: points })
}))

export default function SelectionArea({ drawing }: { drawing: boolean }) {
  const selectionArea = useSelectionArea()
  const [points, setPoints] = useState<[number, number][]>([])
  const [drawMode, setDrawMode] = useState(false)
  // const map = useMapEvents({
  //   mousedown() {
  //     if (drawing) {
  //       map.dragging.disable()
  //       setDrawMode(drawing)
  //     }
  //   },
  //   mousemove(e) {
  //     if (drawMode) {
  //       setPoints([...points, [e.latlng.lat, e.latlng.lng]])
  //     }
  //   },
  //   mouseup() {
  //     if (drawMode) {
  //       setDrawMode(false)
  //       setPoints([])
  //       selectionArea.set(points)
  //       map.dragging.enable()
  //     }
  //   }
  // })
  // return <>
  //   <Polyline positions={points} />
  //   <Polygon positions={selectionArea.polygon} />
  // </>
}
