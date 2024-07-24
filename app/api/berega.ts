import { range } from "../utils";

type EntityType = "developer" | "features" | "residentialcomplex" | "secondhome"
export type Building = {
  title: string,
  shortDescription: [string, string],
  description: [string, string][],
  tag: string,
  price: string,
  lat: number,
  lng: number,
  address: string,
  image: string,
  page: string,
  color: string
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
  return complexes.map((x: any) => {
    const apartmentsInfo = [
      `${x.apartments?.length || 0} апартаментов`,
      `от ${price(x.price_from)}`,
    ];
    return {
      title: x.name,
      shortDescription: apartmentsInfo,
      description: [
        apartmentsInfo,
        [`Дата сдачи • ${x["due_date (OS)"] || "Не известно"}`],
        [`Застройщик • ${developerMap[x["Developer"]]?.name || "Не известен"}`],
      ],
      tag: featureMap?.[x.features?.[0]]?.name || "",
      lat: x.address?.lat || 0,
      lng: x.address?.lng || 0,
      address: x.address?.address || "Нет адреса",
      image: x.pictures?.[0] ? `https:${x.pictures?.[0]}` : undefined,
      page: `https://berega.team/residential_complex/${x._id}`,
      color: "#395296"
    };
  });
}

export async function fetchSecondHomes(): Promise<Building[]> {
  const [homes, features] = await Promise.all([
    fullListOfType("secondhome"),
    fullListOfType("features"),
  ]);
  const featureMap = idMap(features);
  return homes.map((x: any) => ({
    title: x.name,
    shortDescription: ["Цена", price(x.price)],
    description: [
      ["Цена", price(x.price)],
      ["Цена за м²", price(x.price_per_meter || 0)],
      [`${x.floor} этаж, ${x.total_area} м²`],
    ],
    tag: featureMap?.[x.Features?.[0]]?.name || "",
    price: price(x.price),
    lat: x.address?.lat || 0,
    lng: x.address?.lng || 0,
    address: x.address?.address || "Нет адреса",
    image: x.pictures?.[0] ? `https:${x.pictures?.[0]}` : undefined,
    page: `https://berega.team/second_home/${x._id}`,
    color: "#439639"
  }));
}

export async function fetchAllBuildings(): Promise<Building[]> {
  return [...await fetchResidentionalComplexes(), ...await fetchSecondHomes()]
}
