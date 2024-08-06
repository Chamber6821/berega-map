export type Position = {
  lng: number,
  lat: number,
  address: string,
  city: string,
  country: string,
}

export type Frame = 'Черный каркас' | 'Белый каркас' | 'С ремонтом' | 'Под ключ'
export type SecondApartmentType = | 'Жилой дом' | 'Апарт-отель' | 'Таунхаус' | 'Коттедж'
export type FirstApartmentType = 'Квартира' | 'Дом' | 'Земельный участок' | 'Коммерческая недвижимость'
export type SecondApartmentStatus = 'Новостройки' | 'Вторичное жильё'

export type ApartmentBase<Type> = {
  type: Type,
  floor: number,
  price: number,
  area: number,
  frame: Frame,
  rooms: 'Студия' | number,
}

export type SecondApartment =
  ApartmentBase<SecondApartmentType>
  | {
    status: SecondApartmentStatus
  }
export type FirstApartment = ApartmentBase<FirstApartmentType>
export type Apartment = FirstApartment | SecondApartment

export type DescriptionLine = [string, string]

export type Building = {
  name: string,
  position: Position,
  apartments: Apartment[],
  page: URL,
  images: URL[],
  shortDescription: DescriptionLine,
  fullDescription: DescriptionLine[],
  created: Date,
}

export const isSecondApartment = (apartment: Apartment): apartment is SecondApartment =>
  'status' in apartment

export const isFirstApartment = (apartment: Apartment): apartment is FirstApartment =>
  !isSecondApartment(apartment)
