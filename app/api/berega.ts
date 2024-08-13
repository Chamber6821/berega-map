import { FilterGroup, FilterStatus } from "../filters/useFilters";
import { range } from "../utils";

type DescriptionLine = [string] | [string, string]
type EntityType = "developer" | "features" | "residentialcomplex" | "secondhome"
export type Building = {
  title: string,
  tag: string,
  image: string | undefined,
  shortDescription: DescriptionLine,
  description: DescriptionLine[],
  price: number,
  area: number,
  floor: number,
  frame: string,
  location: {
    lat: number,
    lng: number,
    address: string
  }
  page: string,
  group: FilterGroup,
  status?: FilterStatus,
  rooms: 'Студия' | '1' | '2' | '3' | '4' | '5+'
  created: Date,
  API: string
}

export type PointsTypeOpenAPI = {
  id: string;
  latitude: number;
  longitude: number;
  postDate: string;
};

export type BuildingTypeOpenAPI = {
  id: string;
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

const jsonFrom = async (url: RequestInfo | URL) => await (await fetch(url)).json();

const listFrom = async (url: RequestInfo | URL) => (await jsonFrom(url))?.response?.results || [];

const baseUrl = () => "https://berega.team";

const urlForType = (type: EntityType) => new URL(`${baseUrl()}/api/1.1/obj/${type}`);

const urlWithParam = (url: string | URL, param: string, value: any) => {
  const newUrl = new URL(url);
  newUrl.searchParams.set(param, value);
  return newUrl;
};

const listOfType = async (type: EntityType, cursor = 0) =>
  await listFrom(urlWithParam(urlForType(type), "cursor", cursor));

const countOfType = async (type: EntityType) =>
  (await jsonFrom(urlWithParam(urlForType(type), "limit", 1)))?.response
    ?.remaining || 0;

const fullListOfType = async (type: EntityType) =>
  (
    await Promise.all(
      range(Math.ceil((await countOfType(type)) / 100)).map(
        async (x) => await listOfType(type, x * 100),
      ),
    )
  ).reduce((a: any, b: any) => [...a, ...b], []);

const idMap = (list: { _id: string }[]): { [key: string]: any } =>
  list.reduce((obj, element) => ({ ...obj, [element._id]: element }), {});

const price = (count?: number) =>
  (count || 0)
    .toLocaleString("en-US", { style: "currency", currency: "USD" })
    .replace(",", " ")
    .replace("$", "$ ")
    .replace(/\.\d+$/, "");

export const baseUrlAPI = () => "http://91.222.236.241:8080/api/real-estate"

export async function fetchAllPoints(): Promise<PointsTypeOpenAPI[]> {
  const limit = 500;
  let allPoints: PointsTypeOpenAPI[] = [];
  let offset = 0;
  let hasMore = true;
  while (hasMore) {
    const fetchPromises: Promise<PointsTypeOpenAPI[]>[] = [];
    for (let i = 0; i < 10; i++) {
      const url = `${baseUrlAPI()}/points?offset=${offset}&limit=${limit}`;
      fetchPromises.push(
          fetch(url, { cache: 'no-store' })
              .then(res => res.json())
              .then(data => data || [])
      );
      offset += limit;
    }
    const batches = await Promise.all(fetchPromises);
    const batchPoints = batches.flat();
    allPoints = [...allPoints, ...batchPoints];
    hasMore = batchPoints.length === limit * 10;
  }
  return allPoints;
}

export async function getAllBuildingIds() : Promise<string[]> {
  // TODO fetch всех точек и вычлинение id-шников
}

export async function fetchBuildingById(id : string) : Promise<BuildingTypeOpenAPI> {
  // TODO сделать fetch по id-шнику
}

export async function fetchAllBuildingsFromOpenAPI() : Promise<Building[]> {
  // TODO взять id-шники из getAllBuildingIds и по каждому сделать fetch через fetchBuildingById. После чего преобразовать каждый
  // TODO к типу Building и вернуть
}


export async function fetchResidentionalComplexes(): Promise<Building[]> {
  const [developers, features, complexes] = await Promise.all([
    fullListOfType("developer"),
    fullListOfType("features"),
    fullListOfType("residentialcomplex"),
  ]);
  const developerMap = idMap(developers);
  const featureMap = idMap(features);
  return complexes.map((x: any): Building => {
    const apartmentsInfo: DescriptionLine = [
      `${x.apartments?.length || 0} апартаментов`,
      `от ${price(x.price_from)} до ${price(x.price_to)}`,
    ];
    return {
      title: x.name,
      tag: featureMap?.[x.features?.[0]]?.name || "",
      image: x.pictures?.[0] ? `https:${x.pictures?.[0]}` : undefined,
      shortDescription: apartmentsInfo,
      description: [
        apartmentsInfo,
        ['Цена за м²', `от ${price(x.price_per_meter_from)} до ${price(x.price_per_meter_to)}`],
        [`Дата сдачи • ${x["due_date (OS)"] || "Не известно"}`],
        [`Застройщик • ${developerMap[x["Developer"]]?.name || "Не известен"}`],
      ],
      price: x.price_from,
      area: 0,
      floor: 0,
      frame: 'С ремонтом',
      location: {
        lat: x.address?.lat || 0,
        lng: x.address?.lng || 0,
        address: `${x.address?.address || "Нет адреса"} (${x.address?.lat || 0}, ${x.address?.lng || 0})`
      },
      page: `https://berega.team/residential_complex/${x._id}`,
      rooms: '2', // Просто потому что
      group: ['Жилой дом', 'Таунхаус', 'Коттедж'].some(y => x.Type.includes(y)) ? 'Дома, коттеджи, таунхаусы' : 'Новостройки',
      created: new Date(x['Created Date']),
      API: 'Встроенное'
    };
  });
}

export async function fetchSecondHomes(): Promise<Building[]> {
  const [homes, features] = await Promise.all([
    fullListOfType("secondhome"),
    fullListOfType("features"),
  ]);
  const featureMap = idMap(features);
  const groupFor = (x: any): FilterGroup => {
    switch (x.Type) {
      case 'Коммерческая недвижимость':
        switch (x.commercial_type) {
          case 'Отель': return 'Отель'
          case 'Гостевой дом': return 'Гостевой дом'
          case 'Ресторан':
          case 'Кафе': return 'Общепит'
          case 'Офисное помещение': return 'Офисное помещение'
          case 'Склад':
          case 'Завод':
          case 'База': return 'Производственное помещение'
          case 'Универсальное помещение': return 'Свободная планировка'
          default: return 'Вторичное жилье'
        }
      case 'Земельный участок': return 'Земельные участки'
    }

    return 'Вторичное жилье'
  }
  return homes.map((x: any): Building => ({
    title: x.name,
    tag: featureMap?.[x.Features?.[0]]?.name || "",
    image: x.pictures?.[0] ? `https:${x.pictures?.[0]}` : undefined,
    shortDescription: ["Цена", price(x.price)],
    description: [
      ["Цена", price(x.price)],
      ["Цена за м²", price(x.price_per_meter || 0)],
      [`${x.floor} этаж, ${x.total_area} м²`],
    ],
    price: x.price,
    area: x.total_area,
    floor: x.ofloor,
    frame: x['frame (OS)'],
    location: {
      lat: x.address?.lat || 0,
      lng: x.address?.lng || 0,
      address: x.address?.address || "Нет адреса"
    },
    page: `https://berega.team/second_home/${x._id}`,
    rooms: ({
      'Studio': 'Студия',
      '1+1': '1',
      '2+1': '2',
      '3+1': '3',
      '4+1': '4',
      '5+': '5+'
    } as const)[x.rooms as string] || '2',
    group: groupFor(x),
    status: x['status (OS)'],
    created: new Date(x['Created Date']),
    API: 'Встроенное'
  }));
}

export async function fetchAllBuildings(): Promise<Building[]> {
  return [...await fetchResidentionalComplexes(), ...await fetchSecondHomes()]
}
