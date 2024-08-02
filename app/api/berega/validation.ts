import { Apartment, FirstApartment, SecondApartment } from "./types";

export const isSecondApartment = (apartment: Apartment): apartment is SecondApartment =>
  'status' in apartment

export const isFirstApartment = (apartment: Apartment): apartment is FirstApartment =>
  !isSecondApartment(apartment)
