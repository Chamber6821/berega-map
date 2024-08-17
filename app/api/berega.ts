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
  agricultural?: boolean,
  rooms: 'Студия' | '1' | '2' | '3' | '4' | '5+'
  created: Date,
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

export async function fetchResidentionalComplexes(): Promise<Building[]> {
  const [developers, features, complexes] = await Promise.all([
    fullListOfType("developer"),
    fullListOfType("features"),
    fullListOfType("residentialcomplex"),
  ]);
  const developerMap = idMap(developers);
  const featureMap = idMap(features);
  return complexes
    .filter((x: any) => !('hide' in x) || x.hide)
    .map((x: any): Building => {
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
        group: ['Таунхаус', 'Коттедж', 'Вилла'].some(y => x.Type.includes(y)) ? 'Дома, коттеджи' : 'Новостройки',
        created: new Date(x['Created Date'])
      };
    });
}

export async function fetchSecondHomes(): Promise<Building[]> {
  const [homes, features] = await Promise.all([
    fullListOfType("secondhome"),
    fullListOfType("features"),
  ]);
  const featureMap = idMap(features);
  const groupFor = (x: any): FilterGroup => ({
    'Коммерческая недвижимость': 'Коммерческая',
    'Земельный участок': 'Зем. участки',
  } as const)[x.Type as string] || 'Вторичное жилье'
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
    agricultural: x.agricultural,
    created: new Date(x['Created Date'])
  }));
}

export async function fetchAllBuildings(): Promise<Building[]> {
  return [...await fetchResidentionalComplexes(), ...await fetchSecondHomes()]
}
