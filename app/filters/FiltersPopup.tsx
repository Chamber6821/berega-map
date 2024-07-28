import styled from "styled-components";
import { ReactElement, useState } from "react";
import { useDetectClickOutside } from "react-detect-click-outside";
import { CloseOutline } from "react-ionicons";

const Overlay = styled.div`
  position: fixed;
  width: 100dvw;
  height: 100dvh;
  background-color: #09090924;
  z-index: 2000;
`

const Paper = styled.div`
  width: 80%;
  margin: 20px auto 20px;
  padding: 20px;
  background-color: white;
  position: relative;
  border-radius: 12px;
  border-top-right-radius: 0;
`
const Input = styled.input`
  border: 2px solid #EEF5F8;
  border-radius: 8px;
  padding: 10px;
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
`

const ResetButton = styled.button`
    margin: 0px 0px 0px 14px;
    font-size: 12px;
    font-weight: 600;
    color: rgb(73, 73, 73);
    opacity: 0.2;
    cursor: pointer;
`

const AllFiltersButton = styled.button`
  display: flex;
  justify-content: centre;
  align-items: center;
  color: #fff;
  height: 40px;
  padding: 0 10px;
  background: rgb(0, 156, 26);
  border-radius: 8px;
  margin: 0 auto;
`

const VariantButton = styled.button`
    background-color: rgb(255, 255, 255);
    overflow: visible;
    border-style: solid;
    border-width: 2px;
    border-color: rgb(238, 245, 248);
    border-radius: 8px;
    padding: 0px 8px;
    cursor: pointer;
    align-self: center;
    width: max-content;
    height: 33px;
    font-weight: 500px
`

const PressedVariantButton = styled.button`
  color: rgba(0, 156, 26, 1);
  background-color: rgb(255, 255, 255);
    overflow: visible;
    border-style: solid;
    border-width: 2px;
    border-color: rgb(238, 245, 248);
    border-radius: 8px;
    padding: 0px 8px;
    cursor: pointer;
    align-self: center;
    width: max-content;
    height: 33px;
    font-weight: 500px
`

const CloseButton = styled.button`
    position: absolute;
    right: 0;
    top: 0;
    transform: translateX(100%);
    width: 40px;
    height: 40px;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
`

const Filter = ({ name, children }: { name: string, children: any }) =>
  <tr className="filter__line">
    <td style={{ paddingRight: '20px' }}>
      <h2 style={{ textAlign: 'end' }}>{name}</h2>
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
      {FromInput}
      {ToInput}
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
  types: string[],
  rooms: string[],
  priceFrom?: number,
  priceTo?: number,
  country?: string,
  city?: string,
  status?: string[],
  floorFrom?: number,
  floorTo?: number,
  frame: string[],
  areaFrom?: number,
  areaTo?: number,
}

export default function FiltersPopup({ onClose }: { onClose?: (filters: Filters) => void }) {
  const [types, TypesInput] = useVariantInput(['Квартира', 'Дом', 'Земельный участок'])
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
      types,
      rooms,
      priceFrom, priceTo,
      country, city,
      status,
      floorFrom, floorTo,
      frame,
      areaFrom, areaTo,
    })
  }
  const ref = useDetectClickOutside({ onTriggered: handleClose })
  return (
    <Overlay>
      <Paper ref={ref}>
        <CloseButton onClick={handleClose}>
          <CloseOutline color={"#050b0d"} />
        </CloseButton>
        <h1>Фильтры</h1>
        <div className="filter__first">
        <FiltersContainer>
          <Filter name="Выбор страны">{CountryInput}</Filter>
          <Filter name="Выбор города">{CityInput}</Filter>
          <Filter name="Тип">{TypesInput}</Filter>
          <Filter name="Кол-во комнат">{RoomsInput}</Filter>
          <Filter name="Цена">{PriceInput}</Filter>
        </FiltersContainer>
        </div>
        {showAllFilters && <>
          <FiltersContainer>
            <Filter name="Статус">{StatusInput}</Filter>
            <Filter name="Этаж">{FloorInput}</Filter>
            <Filter name="Ремонт">{FrameInput}</Filter>
            <Filter name="Площадь">{AreaInput}</Filter>
          </FiltersContainer>
        </>}
        <AllFiltersButton onClick={() => setShowAllFilters(!showAllFilters)}>
          Все фильтры
        </AllFiltersButton>
      </Paper>
    </Overlay>
  )
}
