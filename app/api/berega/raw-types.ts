export const SecondHomeRoomVariants = ['Studio', '1+1', '2+1', '3+1', '4+1', '5+'] as const
export const SecondHomeStatusVariants = ['Новостройки', 'Вторичное жилье'] as const
export const SecondHomeTypeVariants = ['Дом', 'Квартира', 'Земельный участок', 'Коммерческая недвижимость'] as const

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
  rooms: typeof SecondHomeRoomVariants[number],
  'status (OS)': typeof SecondHomeStatusVariants[number],
  total_area: number,
  Type: typeof SecondHomeTypeVariants[number],
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

export const isStringProperty = <Key extends string>(x: any, key: Key): x is { [key in Key]: string } =>
  key in x && typeof x[key] === 'string'

export const isNumberProperty = <Key extends string>(x: any, key: Key): x is { [key in Key]: number } =>
  key in x && typeof x[key] === 'number'

export const isObjectProperty = <Key extends string>(x: any, key: Key): x is { [key in Key]: object } =>
  key in x && typeof x[key] === 'object'

export const isArrayProperty = <Key extends string>(x: any, key: Key): x is { [key in Key]: Array<any> } =>
  key in x && typeof x[key] === 'object' && 'length' in x[key]

export const isAddress = (x: object): x is { address: string, lng: number, lat: number } =>
  isStringProperty(x, 'address')
  && isNumberProperty(x, 'lat')
  && isNumberProperty(x, 'lng')

export const isRawSecondHome = (x: object): x is RawSecondHome =>
  isObjectProperty(x, 'address') && x.address !== null && isAddress(x.address)
  && isStringProperty(x, 'city (OS)')
  && isStringProperty(x, 'country (OS)')
  && isNumberProperty(x, 'floor')
  && isNumberProperty(x, 'frame (OS)')
  && isStringProperty(x, 'name')
  && isArrayProperty(x, 'pictures') && x.pictures.every(x => typeof x === 'string')
  && isNumberProperty(x, 'price')
  && isNumberProperty(x, 'price_per_meter')
  && isStringProperty(x, 'rooms') && SecondHomeRoomVariants.includes(x.rooms as any)
  && isStringProperty(x, 'status (OS)') && SecondHomeStatusVariants.includes(x['status (OS)'] as any)
  && isNumberProperty(x, 'total_area')
  && isStringProperty(x, 'Type') && SecondHomeTypeVariants.includes(x.Type as any)
  && isStringProperty(x, 'Created Date')

export const isRawResidentionalComplex = (x: object): x is RawResidentionalComplex =>
  isObjectProperty(x, 'address') && x.address !== null && isAddress(x.address)
  && isArrayProperty(x, 'apartments') && x.apartments.every(x => typeof x === 'string')
  && isStringProperty(x, 'city (OS)')
  && isStringProperty(x, 'country (OS)')
  && isStringProperty(x, 'name')
  && isArrayProperty(x, 'pictures') && x.pictures.every(x => typeof x === 'string')
  && isStringProperty(x, 'Created Date')

