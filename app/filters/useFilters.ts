import { create } from "zustand";
import { Building } from "../api/berega";

export const FilterTypes = ['Квартира', 'Дом', 'Земельный участок', 'Коммерческая недвижимость', 'Жилой дом', 'Апарт-отель', 'Таунхаус', 'Коттедж'] as const
export type FilterType = typeof FilterTypes[number]

export const FilterCommercialTypes = ['Отель', 'Гостевой дом', 'Ресторан', 'Кафе', 'Офисное помещение', 'Склад', 'Завод', 'База', 'Универсальное помещение', 'Сельское хозяйство', 'Готовый бизнес', 'Хостел', 'Клиника', 'Автосервис', 'Туризм']
export type FilterCommercialType = typeof FilterCommercialTypes[number]

export const FilterRooms = ['Студия', '1', '2', '3', '4', '5+']
export type FilterRoom = typeof FilterRooms[number]

export const FilterStatuses = ['Новостройки', 'Вторичное жильё']
export type FilterStatus = typeof FilterStatuses[number]

export const FilterFrames = ['Черный каркас', 'Белый каркас', 'С ремонтом', 'Под ключ']
export type FilterFrame = typeof FilterFrames[number]

export type Range = [number | undefined, number | undefined]

export type Filters = {
  country?: string,
  city?: string,
  types: FilterType[],
  commercialTypes: FilterCommercialType[],
  rooms: FilterRoom[],
  status: FilterStatus[],
  frame: FilterFrame[],
  priceRange: Range,
  floorRange: Range,
  areaRange: Range,
}

const matchByVariants = (variants: string[], value?: string) => variants.length === 0 || value && variants.includes(value)
const matchByRange = (range: Range, value: number) =>
  (range[0] === undefined || range[0] <= value)
  && (range[1] === undefined || value <= range[1])

export const filterOf = (filters: Filters) => (building: Building) =>
  matchByVariants(filters.types, building.type)
  && matchByVariants(filters.commercialTypes, building.commertialType)
  && matchByVariants(filters.rooms, building.rooms)
  && matchByVariants(filters.status, building.status)
  && matchByVariants(filters.frame, building.frame)
  // && filters.country === x.country
  // && filters.city === x.city
  && matchByRange(filters.priceRange, building.price)
  && matchByRange(filters.floorRange, building.floor)
  && matchByRange(filters.areaRange, building.area)

export const useFilters = create<Filters & {
  set: (part: Partial<Filters>) => void,
}>((set) => ({
  types: [],
  commercialTypes: [],
  rooms: [],
  status: [],
  frame: [],
  priceRange: [undefined, undefined],
  floorRange: [undefined, undefined],
  areaRange: [undefined, undefined],
  set,
}))
