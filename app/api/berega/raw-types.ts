export type RawSecondHome = {
  address: {
    address: string,
    lng: number,
    lat: number,
  },
  'city (OS)': string,
  'country (OS)': string,
  floor: number,
  'frame (OS)': string,
  name: string,
  pictures: string[],
  price: number,
  price_per_meter: number,
  rooms: 'Studio' | '1+1' | '2+1' | '3+1' | '4+1' | '5+',
  'status (OS)': 'Новостройки' | 'Вторичное жилье',
  total_area: number,
  Type: 'Дом' | 'Квартира' | 'Земельный участок' | 'Коммерческая недвижимость',
  'Created Date': string,
}

export type RawResidentionalComplex = {
  address: {
    address: string,
    lng: number,
    lat: number,
  },
  apartments: string[],
  'city (OS)': string,
  'country (OS)': string,
  name: string,
  pictures: string[],
  'Created Date': string,
}

export type RawApartment = {
  floor: number,
  frame: string,
  price_per_meter: number,
  price_total: number,
  rooms_qty: string,
  status: string,
  total_area: number,
}
