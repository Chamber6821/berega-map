'use client'

import L from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import SelectionArea from "./SelectionArea";
import { useEffect, useRef, useState } from "react";
import Control from "react-leaflet-custom-control";
import * as maptiler from "@maptiler/sdk"
import "@maptiler/sdk/dist/maptiler-sdk.css"
import { Building } from "../api/berega";
import { createElement } from "../utils";

const iconForCluster = (cluster: any) => L.divIcon({
  html: `<p>${cluster.getChildCount()}</p>`,
  className: 'cluster-icon',
  iconSize: L.point(30, 30)
})

export default function Map({ center, zoom, buildings }: { center: [number, number], zoom: number, buildings: Building[] }) {
  const [drawMode, setDrawMode] = useState(false)
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maptiler.Map>()

  useEffect(() => {
    if (map.current) return
    maptiler.config.apiKey = "uL0rwqFI3ByfHOEQrTJP"

    map.current = new maptiler.Map({
      container: mapContainer.current as HTMLDivElement,
      style: 'streets-v2',
      center: center,
      zoom: zoom,
      terrain: true,
    })

    buildings.map(x =>
      new maptiler.Marker({
        element: createElement(`<img width="20px" src="https://img.icons8.com/ios-filled/100/${x.color.replace("#", "")}/100-percents.png"/>`)
      })
        .setLngLat([x.lng, x.lat])
        .addTo(map.current as maptiler.Map))
  })

  return <div className="map" ref={mapContainer}></div>
  return <MapContainer
    center={center}
    zoom={zoom}
    scrollWheelZoom={true}
  >
    <TileLayer
      url="https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=uL0rwqFI3ByfHOEQrTJP"
    />
    <MarkerClusterGroup
      iconCreateFunction={iconForCluster}
      maxClusterRadius={40}
    >
    </MarkerClusterGroup>
    <SelectionArea drawing={drawMode} />
    <Control prepend position="topright">
      {
        drawMode
          ?
          <button className="map-button" onClick={() => setDrawMode(false)}>
            <p>Закончить выделение</p>
          </button>
          :
          <button className="map-button" onClick={() => setDrawMode(true)}>
            <p>Выделить область</p>
          </button>
      }
    </Control>
  </MapContainer >
}
