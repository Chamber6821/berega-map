import { create } from "zustand";
import { Building } from "../api/berega";

export const FilterGroups = ['Новостройки', 'Вторичное жилье', 'Дома, коттеджи', 'Зем. участки', 'Коммерческая'] as const
export type FilterGroup = typeof FilterGroups[number]

export const FilterRooms = ['Студия', '1', '2', '3', '4', '5+']
export type FilterRoom = typeof FilterRooms[number]

export const FilterStatuses = ['Новостройки', 'Вторичное жильё']
export type FilterStatus = typeof FilterStatuses[number]

export const FilterApies = ['Встроенное', 'Внешнее'] as const
export type FilterApi = typeof FilterApies[number]

export const FilterFrames = ['Черный каркас', 'Белый каркас', 'С ремонтом', 'Под ключ']
export type FilterFrame = typeof FilterFrames[number]

export const FilterAgriculturals = [true, false]
export type FilterAgricultural = typeof FilterAgriculturals[number]

export type Range = [number | undefined, number | undefined]

export type Filters = {
  country?: string,
  city?: string,
  createdAfter?: Date,
  groups: FilterGroup[],
  rooms: FilterRoom[],
  status: FilterStatus[],
  frame: FilterFrame[],
  agriculturals: FilterAgricultural[],
  priceRange: Range,
  floorRange: Range,
  areaRange: Range,
  api: FilterApi,
  searchParams?: URLSearchParams
}

const matchByVariants = <T,>(variants: T[], value?: T) => variants.length === 0 || value !== undefined && variants.includes(value)
const matchByRange = (range: Range, value: number) =>
  (range[0] === undefined || range[0] <= value)
  && (range[1] === undefined || value <= range[1])

export const filterOf = (filters: Filters) => (building: Building) =>
  (!filters.createdAfter || filters.createdAfter.getTime() < building.created.getTime())
  && matchByVariants(filters.rooms, building.rooms)
  && matchByVariants(filters.groups, building.group)
  && matchByVariants(filters.frame, building.frame)
  && matchByVariants(filters.agriculturals, building.agricultural)
  // && filters.country === x.country
  // && filters.city === x.city
  && matchByRange(filters.priceRange, building.price)
  && matchByRange(filters.floorRange, building.floor)
  && matchByRange(filters.areaRange, building.area)

// Из-за кривости FiltersHeader
// здесь нельзя менять значения по умолчанию (они должны совпадать со значениями в FiltersHeader)
// Инициализация фильтров сделана в FiltersHeader
export const useFilters = create<Filters & {
  set: (part: Partial<Filters>) => void,
}>((set) => ({
  rooms: [],
  groups: [],
  status: [],
  frame: [],
  agriculturals: [],
  priceRange: [undefined, undefined],
  floorRange: [undefined, undefined],
  areaRange: [undefined, undefined],
  api: 'Встроенное',
  set,
}))
