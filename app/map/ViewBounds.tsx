import { LatLngBounds } from "leaflet"
import { useMapEvents } from "react-leaflet"

export default function ViewBounds({ onChanged }: { onChanged?: (bounds: LatLngBounds) => void }) {
  const map = useMapEvents({
    moveend: () => onChanged && onChanged(map.getBounds())
  })
  return <></>
}

