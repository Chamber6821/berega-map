import { range } from "../utils";
import { isRawResidentionalComplex, isRawSecondHome, RawResidentionalComplex, RawSecondHome } from "./berega/raw-types";
import { Building, DescriptionLine } from "./berega/types";

type EntityType = "developer" | "features" | "residentialcomplex" | "secondhome" | "apartments"

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

const idMap = <T extends { _id: string }>(list: T[]): { [key: string]: T } =>
  list.reduce((obj, element) => ({ ...obj, [element._id]: element }), {});

const price = (count?: number) =>
  (count || 0)
    .toLocaleString("en-US", { style: "currency", currency: "USD" })
    .replace(",", " ")
    .replace("$", "$ ")
    .replace(/\.\d+$/, "");

export async function fetchResidentionalComplexes(): Promise<Building[]> {
  const [developers, complexes] = await Promise.all([
    fullListOfType("developer"),
    fullListOfType("residentialcomplex"),
    fullListOfType("apartments")
  ]);
  const developerMap = idMap(developers);
  const brokenComplexes = complexes.filter((x: any) => !isRawResidentionalComplex(x))
  if (brokenComplexes.length) console.log(brokenComplexes)
  const correctComplexes: RawResidentionalComplex[] = complexes.filter((x: any) => isRawResidentionalComplex(x))
  return correctComplexes.map((x): Building => {
    const apartmentsInfo: DescriptionLine = [
      `${x.apartments?.length || 0} апартаментов`,
      `от ${price(x.price_from)} до ${price(x.price_to)}`,
    ];
    return {
      title: x.name,
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
      type: x.Type[0] || 'Жилой дом',
      floor: 0,
      frame: 'С ремонтом',
      location: {
        lat: x.address?.lat || 0,
        lng: x.address?.lng || 0,
        address: `${x.address?.address || "Нет адреса"} (${x.address?.lat || 0}, ${x.address?.lng || 0})`
      },
      page: new URL(`https://berega.team/residential_complex/${x._id}`),
      created: new Date(x['Created Date'])
    };
  });
}

export async function fetchSecondHomes(): Promise<Building[]> {
  const [homes] = await Promise.all([
    fullListOfType("secondhome"),
  ]);
  const brokenHomes = homes.filter((x: any) => !isRawSecondHome(x))
  if (brokenHomes.length > 0) console.log('broken second homes', brokenHomes)
  const correctHomes: RawSecondHome[] = homes.filter((x: any) => isRawSecondHome(x))
  return correctHomes.map((x): Building => ({
    name: x.name,
    position: {
      lng: x.address.lng,
      lat: x.address.lat,
      address: x.address.address,
      city: x["city (OS)"],
      country: x["country (OS)"],
    },
    apartments: [
      {
        type: x.Type,
        floor: x.floor,
        price: x.price,
        area: x.total_area,
        frame: x["frame (OS)"] as any,
        rooms: 0
      }
    ],
    page: new URL(`https://berega.team/second_home/${x._id}`),
    images: x.pictures.map(x => new URL(`https:${x}`)),
    shortDescription: ["Цена", price(x.price)],
    fullDescription: [
      ["Цена", price(x.price)],
      ["Цена за м²", price(x.price / x.total_area)],
      [`${x.floor} этаж, ${x.total_area} м²`, ''],
    ],
    created: new Date(x['Created Date'])
  }));
}

export async function fetchAllBuildings(): Promise<Building[]> {
  return [...await fetchResidentionalComplexes(), ...await fetchSecondHomes()]
}
