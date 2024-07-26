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
  overflow-x: scroll;
`

const Paper = styled.div`
  width: 80%;
  margin: 20px auto 20px;
  padding: 20px;
  background-color: white;
  border-radius: 16px;
  position: relative;
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
  gap: 4px;
`

const ResetButton = styled.button`
  color: rgba(12, 18, 12, 1);
  margin-left: 16px;
`

const AllFiltersButton = styled.button``

const VariantButton = styled.button`
  border: 2px solid;
`

const PressedVariantButton = styled.button`
  color: #7f7f7f;
  border: 2px solid #7f7f7f;
`

const CloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  transform: translateX(100%);
  scale: 1.5;
`

const HorizontalLine = styled.div`
  width: 100%;
  height: 2px;
  background-color: #EEF5F8;
`

const Filter = ({ name, children }: { name: string, children: any }) =>
  <tr>
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

const useInputText = (): [string | undefined, React.ReactElement] => {
  const [text, setText, input] = useInput<string>({ type: 'text' })
  const group =
    <InputGroup>
      {input}
      <ResetButton onClick={() => setText(undefined)}>
        Сбросить
      </ResetButton>
    </InputGroup>
  return [text, group]
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
          <CloseOutline color={"#EEF5F8"} />
        </CloseButton>
        <h1>Фильтры</h1>
        <FiltersContainer>
          <Filter name="Тип">{TypesInput}</Filter>
          <Filter name="Кол-во комнат">{RoomsInput}</Filter>
          <Filter name="Цена">{PriceInput}</Filter>
          <Filter name="Страна">{CountryInput}</Filter>
          <Filter name="Город">{CityInput}</Filter>
        </FiltersContainer>
        <AllFiltersButton onClick={() => setShowAllFilters(!showAllFilters)}>
          Все фильтры
        </AllFiltersButton>
        {showAllFilters && <>
          <HorizontalLine />
          <FiltersContainer>
            <Filter name="Статус">{StatusInput}</Filter>
            <Filter name="Этаж">{FloorInput}</Filter>
            <Filter name="Ремонт">{FrameInput}</Filter>
            <Filter name="Площадь">{AreaInput}</Filter>
          </FiltersContainer>
        </>}
      </Paper>
    </Overlay>
  )
}
