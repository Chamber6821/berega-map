'use client'

import { useEffect, useRef, useState } from "react";
import { Building } from "../api/berega";
import { createElement } from "../utils";

import mapbox, { GeoJSONSource, LngLat, Map as MapboxMap, Marker, NavigationControl } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import Polygon from "./Polygon";
import Polyline from "./Polyline";

// const iconForCluster = (cluster: any) => L.divIcon({
//   html: `<p>${cluster.getChildCount()}</p>`,
//   className: 'cluster-icon',
//   iconSize: L.point(30, 30)
// })

const isGeoJsonSource = (x: mapboxgl.Source): x is mapboxgl.GeoJSONSource => x.type == 'geojson'

export default function Map({ center, zoom, buildings }: { center: [number, number], zoom: number, buildings: Building[] }) {
  const [drawMode, setDrawMode] = useState(false)
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map>()

  useEffect(() => {
    mapbox.accessToken = "pk.eyJ1IjoiY2hhbWJlcjY4MjEiLCJhIjoiY2xyZjY4MDBrMDF0bjJrbzU0djA2bnJueCJ9.sTgEkqcR0I_Yqjl0CTOQvA"
    mapRef.current = new MapboxMap({
      container: mapContainer.current as HTMLDivElement,
      center: [center[1], center[0]],
      zoom: zoom,
    })
    const map = mapRef.current as MapboxMap
    const polygon = new Polygon(map, 'polygon', {
      borderColor: '#FF5000',
      borderWidth: 2,
      fillColor: '#0080FF',
      fillOpacity: 0.8
    })

    map
      .addControl(new NavigationControl({ visualizePitch: true }))
      .on('mousemove', e => polygon.path = [...polygon.path, e.lngLat])
      .on('mouseover', () => polygon.show())
      .on('mouseout', () => polygon.hide())

    buildings.map(x =>
      new Marker({
        element: createElement(`<img width="20px" src="https://img.icons8.com/ios-filled/100/${x.color.replace("#", "")}/100-percents.png"/>`),
      })
        .setLngLat([x.lng, x.lat])
        .addTo(mapRef.current as MapboxMap))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <div className="map" ref={mapContainer}></div>
  // return <MapContainer
  //   center={center}
  //   zoom={zoom}
  //   scrollWheelZoom={true}
  // >
  //   <TileLayer
  //     url="https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=uL0rwqFI3ByfHOEQrTJP"
  //   />
  //   <MarkerClusterGroup
  //     iconCreateFunction={iconForCluster}
  //     maxClusterRadius={40}
  //   >
  //   </MarkerClusterGroup>
  //   <SelectionArea drawing={drawMode} />
  //   <Control prepend position="topright">
  //     {
  //       drawMode
  //         ?
  //         <button className="map-button" onClick={() => setDrawMode(false)}>
  //           <p>Закончить выделение</p>
  //         </button>
  //         :
  //         <button className="map-button" onClick={() => setDrawMode(true)}>
  //           <p>Выделить область</p>
  //         </button>
  //     }
  //   </Control>
  // </MapContainer >
}
