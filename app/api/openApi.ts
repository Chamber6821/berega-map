import { Building, DescriptionLine } from "./berega";
import { FilterGroup, Filters, FilterStatus } from "../filters/useFilters";

export type PointsTypeOpenApi = {
  id: string;
  latitude: number;
  longitude: number;
  houseStatus: FilterGroup;
};

export type PointsCountTypeOpenApi = {
  counter: number,
  latitude: number,
  longitude: number,
  houseStatus: FilterGroup;
}

export type BuildingTypeOpenApi = {
  id: string;
  url: string,
  title: string;
  house_type: string;
  transaction_type: string;
  house_status: string;
  address: string;
  post_date: string;
  owner_name: string;
  images: string[];
  description: string;
  price_usd: number;
  price_gel: number;
  price_per_square_usd: number;
  price_per_square_gel: number;
  latitude: number;
  longitude: number;
  renovation: string;
  project: string;
  area: number;
  rooms: string;
  floor: number;
  yard_area: number;
  house_floors: number;
  ceiling_height: number;
  bedroom: string;
  bathrooms: string;
  balcony_area: number;
  hot_water: string;
  heating: string;
  parking: string;
  has_electricity: boolean;
  has_natural_gas: boolean;
  has_sewage: boolean;
  has_water: boolean;
  has_furniture: boolean;
  has_loggia: boolean;
  has_passenger_elevator: boolean;
  has_service_elevator: boolean;
  has_viber: boolean;
  has_whatsapp: boolean;
  is_urgent: boolean;
  is_highlighted: boolean;
  is_moved_up: boolean;
  user_entity_type: string;
  agency_name: string;
  subway_station: string;
  has_remote_viewing: boolean;
  company_name: string;
  company_logo: string;
  project_name: string;
  project_id: number;
  garage: boolean;
  kitchen_area: string;
  house_will_have_to_live: string;
  commercial_type: number;
  user_application_count: number;
  price_level: string;
}

const baseOpenApiUrl = () => "https://berega.tech/api/real-estate";

const radiusKm = 10;

const popularPlaces = [
  { centerLatitude: 41.7151, centerLongitude: 44.8271 }, // Тбилиси
  { centerLatitude: 42.2679, centerLongitude: 42.6946 }, // Кутаиси
  { centerLatitude: 41.6168, centerLongitude: 41.6367 }, // Батуми
  { centerLatitude: 41.5400, centerLongitude: 45.0000 }, // Рустави
  { centerLatitude: 42.5088, centerLongitude: 41.8709 }  // Зугдиди
]

export const convertBuilding = async (building: BuildingTypeOpenApi): Promise<Building> => {
  const shortDescription: DescriptionLine = [
    ''
  ];
  const description: DescriptionLine[] = [
    ["Цена", building.price_usd.toLocaleString('en-US', { style: 'currency', currency: 'USD' })],
    ['Цена за м²', `${building.price_per_square_usd.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`],
    [`${building.floor ? building.floor : '-'} этаж, ${building.area} м²`],
    ...(building.house_status === 'New building' ? [['Владелец', building.owner_name ? building.owner_name : 'Неизвестно'] as [string, string]] : [])
  ];

  const group: FilterGroup = building.house_status === 'new' ? 'Новостройки' : 'Вторичное жилье';
  const rooms = ({
    'Студия': 'Студия',
    '1': '1',
    '2': '2',
    '3': '3',
    '4': '4',
    '5+': '5+'
  } as const)[building.rooms] || '2';
  return {
    title: building.title,
    tag: building.renovation,
    image: building.images?.[0],
    shortDescription,
    description,
    price: building.price_usd,
    area: building.area,
    floor: building.floor,
    frame: building.renovation,
    location: {
      lat: building.latitude,
      lng: building.longitude,
      address: building.address
    },
    page: `https://${building.url}`,
    group,
    rooms,
    created: new Date(building.post_date),
  };
}

const filtersAsQuery = (filters: Filters): URLSearchParams => {
  if (filters.searchParams)
    return filters.searchParams
  return new URLSearchParams(([
    ['minPriceUsd', filters.priceRange[0]],
    ['maxPriceUsd', filters.priceRange[1]],
    ['minArea', filters.areaRange[0]],
    ['maxArea', filters.areaRange[1]],
    ['minFloor', filters.floorRange[0]],
    ['maxFloor', filters.floorRange[1]],
    ...filters.rooms.map(x => ['rooms', x]),
    ...filters.groups.map(x => (<Record<FilterGroup, string>>{
      'Новостройки': 'New building',
      'Вторичное жилье': 'Old building',
      'Дома, коттеджи': 'Finished',
      'Зем. участки': 'Investment / for construction',
      'Коммерческая': 'Commercial',
    })[x]).map(x => ['houseStatus', x]),
    ...filters.status.map(x => (<Record<FilterStatus, string>>{
      'Новостройки': 'New building',
      'Вторичное жилье': 'Old building',
    })[x]).map(x => ['houseStatus', x]),
    ['frame', filters.frame.join(',')],
    ['createdAfter', filters.createdAfter && new Date(filters.createdAfter).toISOString().replace('Z', '+04:00')]
  ] as const)
    .filter(x => x[1])
    .map(x => [x[0], `${x[1]}`])
  )
}

const urlForFilteredPoints = (
  center: [number, number],
  size: number,
  filters: Filters
) =>
  `${baseOpenApiUrl()}/filter?${new URLSearchParams({
    centerLatitude: center[1].toString(),
    centerLongitude: center[0].toString(),
    radiusKm: radiusKm.toString(),
    page: '0',
    size: size.toString(),
  })}&${filtersAsQuery(filters)}`

export const fetchPointsCounter = async (
  filters: Filters
): Promise<PointsCountTypeOpenApi[]> => {
  const houseStatus = [...filters.groups, ...filters.status]
  const params = filtersAsQuery(filters)
  return (await Promise.all(popularPlaces.map(async place =>
    <PointsCountTypeOpenApi>{
      counter: await (
        await fetch(
          `${baseOpenApiUrl()}/count?${new URLSearchParams({
            centerLatitude: place.centerLatitude.toString(),
            centerLongitude: place.centerLongitude.toString()
          })}&${new URLSearchParams({ radiusKm: '5' })}&${params}`,
          { cache: 'no-store' }
        )
      ).json(),
      latitude: place.centerLatitude,
      longitude: place.centerLongitude,
      houseStatus: houseStatus[0],
    }
  ))).filter(x => x.counter > 0)
}

export const fetchFilteredPoints = async (
  center: [number, number],
  size: number,
  filters: Filters
): Promise<PointsTypeOpenApi[]> => {
  const url = urlForFilteredPoints(center, size, filters);
  const response = await fetch(url, { cache: 'no-store' });
  const points: PointsTypeOpenApi[] = await response.json();
  return points.map((point) => {
    const houseStatus = filters.groups[0];
    return {
      ...point,
      houseStatus,
    };
  });
}

export const fetchBuildingById = async (id: string): Promise<BuildingTypeOpenApi> => {
  return (await fetch(`${baseOpenApiUrl()}/${id}`, { cache: 'no-store' })).json();
};

export const fetchBuilding = async (id: string): Promise<Building> => {
  return await convertBuilding(await fetchBuildingById(id));
}
