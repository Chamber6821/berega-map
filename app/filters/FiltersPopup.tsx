import styled from "styled-components";
import { useState } from "react";
import PrimaryButton from "../components/PrimaryButton";
import Modal from "../components/Modal";

const Input = styled.input`
  border: 2px solid #EEF5F8;
  border-radius: 8px;
  padding: 10px;
  max-height: 33px;
  max-width: 110px;
  outline: none;
  font-weight: 500;

  &::placeholder{
  font-size: 14px;
  font-weight: 500;
}
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`

const ResetButton = styled.button`
    margin: 0px 0px 0px 14px;
    font-size: 12px;
    font-weight: 600;
    color: rgb(73, 73, 73);
    opacity: 0.2;
    cursor: pointer;
    @media(max-width: 400px){
    &{
    font-size: 10px
    }
    }
`

const AllFiltersButton = PrimaryButton

const VariantButton = styled.button`
    background-color: rgb(255, 255, 255);
    overflow: visible;
    padding: 0px 8px;
    cursor: pointer;
    align-self: center;
    width: max-content;
    height: 33px;
    font-weight: 500;
    border-radius: 8px;
    @media(hover: hover){
    &:hover{
    color: rgb(0, 156, 26)
    }
}
`

const PressedVariantButton = styled.button`
  color: rgba(0, 156, 26, 1);
  background-color: rgb(255, 255, 255);
    overflow: visible;
    border-color: rgb(238, 245, 248);
    border-radius: 8px;
    padding: 0px 8px;
    cursor: pointer;
    align-self: center;
    width: max-content;
    height: 33px;
    font-weight: 500;
`

const Filter = ({ name, children }: { name: string, children: any }) =>
  <tr className="filter__line">
    <td style={{ paddingRight: '20px' }}>
      <h2>{name}</h2>
    </td>
    <td>{children}</td>
  </tr>

const useInput = <T,>({ type, placeholder = '', validator = x => x as T }:
  { type: React.HTMLInputTypeAttribute, placeholder?: string, validator?: (value: string) => T | undefined }):
  [T | undefined, (x: T | undefined) => void, React.ReactElement] => {
  const [value, setValue] = useState<T>()
  const input =
    <Input
      type={type}
      placeholder={placeholder}
      value={`${value}`}
      onChange={e => setValue(validator(e.target.value))}
    />
  return [value, setValue, input]
}

const FiltersContainer = ({ children }: { children: any }) => <table><tbody>{children}</tbody></table>

const useRangeInput = (): [number | undefined, number | undefined, React.ReactElement] => {
  const validator = (x: string) => x === "" ? undefined : Math.max(0, +x)
  const [from, setFrom, FromInput] = useInput<number>({ type: 'number', placeholder: "От", validator })
  const [to, setTo, ToInput] = useInput<number>({ type: 'number', placeholder: "До", validator })
  const group =
    <InputGroup>
      <div className="input-container input-container__number">
        {FromInput}
        -
        {ToInput}
      </div>
      <ResetButton onClick={() => {
        setFrom(undefined)
        setTo(undefined)
      }}>
        Сбросить
      </ResetButton>
    </InputGroup>
  return [from, to, group]
}

const useVariantInput = <T extends string,>(variants: T[]): [T[], React.ReactElement] => {
  const [selected, setSelected] = useState<T[]>([])
  const group =
    <div className="input-container">
      <InputGroup>
        {
          selected.length === 0
            ? <PressedVariantButton>
              Не важно
            </PressedVariantButton>
            : <VariantButton onClick={() => setSelected([])}>
              Не важно
            </VariantButton>
        }
        {
          variants.map(x =>
            selected.includes(x)
              ? <PressedVariantButton
                key={x}
                onClick={() => setSelected(selected.filter(y => y !== x))}
              >
                {x}
              </PressedVariantButton>
              : <VariantButton
                key={x}
                onClick={() => setSelected([...selected, x])}
              >
                {x}
              </VariantButton>
          )
        }
      </InputGroup>
    </div>
  return [selected, group]
}

const useInputText = (): [string, React.ReactElement] => {
  const [text, setText, input] = useInput<string>({ type: 'text' })
  if (text === undefined) setText('')
  const group =
    <InputGroup>
      {input}
      <ResetButton onClick={() => setText(undefined)}>
        Сбросить
      </ResetButton>
    </InputGroup>
  return [text || '', group]
}

export type Filters = {
  types?: string[],
  rooms?: string[],
  status?: string[],
  frame?: string[],
  country?: string,
  city?: string,
  priceFrom?: number,
  priceTo?: number,
  floorFrom?: number,
  floorTo?: number,
  areaFrom?: number,
  areaTo?: number,
}

const listOrDefault = <T, P>(elements: T[], or: P): T[] | P =>
  elements.length === 0
    ? or
    : elements

export default function FiltersPopup({ visible, onClose }: { visible: boolean, onClose?: (filters: Filters) => void }) {
  const [types, TypesInput] = useVariantInput(['Квартира', 'Дом', 'Земельный участок', 'Коммерческая недвижимость', 'Жилой дом', 'Апарт-отель', 'Таунхаус', 'Коттедж'])
  const [rooms, RoomsInput] = useVariantInput(['Студия', '1', '2', '3', '4', '5+'])
  const [priceFrom, priceTo, PriceInput] = useRangeInput()
  const [country, CountryInput] = useInputText()
  const [city, CityInput] = useInputText()
  const [status, StatusInput] = useVariantInput(['Новостройка', 'Вторичное жилье', 'Переуступка'])
  const [floorFrom, floorTo, FloorInput] = useRangeInput()
  const [frame, FrameInput] = useVariantInput(['Черный каркас', 'Белый каркас', 'С ремонтом', 'Под ключ'])
  const [areaFrom, areaTo, AreaInput] = useRangeInput()
  const [showAllFilters, setShowAllFilters] = useState(false)
  const handleClose = () => {
    setShowAllFilters(false)
    onClose && onClose({
      types: listOrDefault(types, undefined),
      rooms: listOrDefault(rooms, undefined),
      status: listOrDefault(status, undefined),
      frame: listOrDefault(frame, undefined),
      country, city,
      priceFrom, priceTo,
      floorFrom, floorTo,
      areaFrom, areaTo,
    })
  }
  return (
    <Modal style={visible ? {} : { display: 'none' }} onClose={handleClose}>
      <h1 className="filter__title">Фильтры</h1>
      <div className="filter__table filter__first">
        <FiltersContainer>
          {/* <Filter name="Выбор страны">{CountryInput}</Filter> */}
          {/* <Filter name="Выбор города">{CityInput}</Filter> */}
          <Filter name="Тип">{TypesInput}</Filter>
          <Filter name="Кол-во комнат">{RoomsInput}</Filter>
          <Filter name="Цена, $">{PriceInput}</Filter>
        </FiltersContainer>
      </div>
      {showAllFilters && <>
        <h2 className="filter__title filter__title-more">Дополнительные фильтры</h2>
        <div className="filter__table filter__table-more">
          <FiltersContainer>
            {/* <Filter name="Статус">{StatusInput}</Filter> */}
            <Filter name="Этаж">{FloorInput}</Filter>
            <Filter name="Ремонт">{FrameInput}</Filter>
            <Filter name="Площадь, м²">{AreaInput}</Filter>
          </FiltersContainer>
        </div>
      </>}
      <AllFiltersButton onClick={() => setShowAllFilters(!showAllFilters)}>
        {showAllFilters ? 'Скрыть фильтры' : 'Все фильтры'}
      </AllFiltersButton>
      <PrimaryButton style={{ marginLeft: 0 }} onClick={handleClose}>Показать результаты</PrimaryButton>
    </Modal>
  )
}
