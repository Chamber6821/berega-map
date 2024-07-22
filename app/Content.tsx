'use client'

import { Building } from "./api/berega";
import Card from "./Card";
import { BuildingMarker, Map } from "./map";
import { average } from "./utils";

export default function Content({ buildings }:
  { buildings: Building[] }) {
  return <div className="root-container">
    <Map
      center={[average(buildings.map(x => x.lat)), average(buildings.map(x => x.lng))]}
      zoom={6}
    >
      {
        buildings
          .map(x => <BuildingMarker key={x.page} position={[x.lat, x.lng]} color={x.color} />)
      }
    </Map>
    <div className="cards-container">
      {
        buildings
          .map(
            x => <Card
              key={x.page}
              image={x.image}
              title={x.title}
              description={x.shortDescription}
              page={x.page}
            />)
      }
      <Card
        image="https://7e84f1a57df011c41fb576b3421bc0e8.cdn.bubble.io/f1700519301609x437900309108657100/3335.jpg"
        title="Blue Sky Tower"
        description={["174 апартаментов", "от $ 46 150"]}
        page=""
      />
    </div>
  </div >

}
