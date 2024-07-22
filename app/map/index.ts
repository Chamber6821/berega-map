import dynamic from 'next/dynamic';

export const Map = dynamic(() => import('./Map'), { ssr: false })
export const BuildingMarker = dynamic(() => import('./BuildingMarker'), { ssr: false })
