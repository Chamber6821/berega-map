import dynamic from 'next/dynamic'

export const Map = dynamic(async () => await import('./Map'), { ssr: false })
