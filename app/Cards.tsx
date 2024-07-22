import { Building } from "./api/berega";
import Card from "./Card";
import { useSelectionArea } from "./map/SelectionArea";
import { inside } from "./utils";

export default function Cards({ buildings }: { buildings: Building[] }) {
  const polygon = useSelectionArea(x => x.polygon)
  return <div className="cards-container">
    {
      buildings
        .filter(x => polygon.length == 0 || inside([x.lat, x.lng], polygon))
        .map(
          x => <Card
            key={x.page}
            image={x.image}
            title={x.title}
            description={x.shortDescription}
            page={x.page}
          />)
    }
  </div>
}
