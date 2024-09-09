import { fetchAllBuildings } from './api/berega'
import BeregaBuildginsInitializator from './api/BregaBuildingsInitializator'
import Content from './Content'

export default async function Home() {
  return <BeregaBuildginsInitializator buildings={await fetchAllBuildings()}  >
    <Content />
  </BeregaBuildginsInitializator>
}