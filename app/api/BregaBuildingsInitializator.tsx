'use client'

import { useBuildings } from "../useBuildings"
import { Building } from "./berega"

export default function BeregaBuildginsInitializator({ buildings, children }: { buildings: Building[], children: any }) {
  useBuildings.setState({
    loadFromBerega: filter => useBuildings.setState({ buildings: buildings.filter(filter) })
  })
  return children
}

