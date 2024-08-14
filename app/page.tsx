import { fetchAllBuildings } from './api/berega'
import Content from './Content'

export default async function Home () {
  return <Content buildings={await fetchAllBuildings()} />
}
