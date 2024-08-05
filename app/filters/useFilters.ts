import { create } from "zustand";

export const FilterTypes = ['Квартира', 'Дом', 'Земельный участок', 'Коммерческая недвижимость', 'Жилой дом', 'Апарт-отель', 'Таунхаус', 'Коттедж'] as const
export type FilterType = typeof FilterTypes[number]

export const FilterRooms = ['Студия', '1', '2', '3', '4', '5+']
export type FilterRoom = typeof FilterRooms[number]

export const FilterStatuses = ['Новостройка', 'Вторичное жилье', 'Переуступка']
export type FilterStatus = typeof FilterStatuses[number]

export const FilterFrames = ['Черный каркас', 'Белый каркас', 'С ремонтом', 'Под ключ']
export type FilterFrame = typeof FilterFrames[number]

export type Range = [number | undefined, number | undefined]

export type Filters = {
  country?: string,
  city?: string,
  types: FilterType[],
  rooms: FilterRoom[],
  status: FilterStatus[],
  frame: FilterFrame[],
  priceRange: Range,
  floorRange: Range,
  areaRange: Range,
}

export const useFilters = create<Filters & { set: (part: Partial<Filters>) => void }>((set) => ({
  types: [],
  rooms: [],
  status: [],
  frame: [],
  priceRange: [undefined, undefined],
  floorRange: [undefined, undefined],
  areaRange: [undefined, undefined],
  set,
}))
