import { Building } from './api/berega'
import Card from './Card'

export default function Cards ({ buildings }: { buildings: Building[] }) {
  return (
    <div className='cards-container'>
      {
      buildings
        .map(
          x => <Card
            key={x.page}
            image={x.image || ''}
            title={x.title}
            description={x.shortDescription.length === 1 ? [x.shortDescription[0], ''] : x.shortDescription}
            page={x.page}
               />)
    }
    </div>
  )
}
