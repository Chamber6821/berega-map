import Card from './Card'
import Map from './Map'

export default function Home() {
  return <div className="root-container">
    <Map />
    <div className="cards-container">
      <Card
        image="https://7e84f1a57df011c41fb576b3421bc0e8.cdn.bubble.io/f1700519301609x437900309108657100/3335.jpg"
        title="Blue Sky Tower"
        description={["174 апартаментов", "от $ 46 150"]}
        page=""
      />
    </div>
  </div>
}
