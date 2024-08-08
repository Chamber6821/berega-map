import { useWindowWidth } from "@react-hook/window-size"
import { useEffect, useState } from "react"
import { ChevronDownOutline, ChevronUpOutline } from "react-ionicons"
import styled from "styled-components"
import { FilterRooms, Range, useFilters } from "./useFilters"

const Filter = styled.div`
  position: relative;
`

const Filters = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  gap: 10px;
`

const SelectButton = styled.button`
  display: flex;
  align-items: center;
  gap: 7px;
  border: 1px solid rgb(164, 170, 180);
  border-radius: 8px;
  padding: 7px 10px;
  font-weight: 500;

  @media(max-width: 360px) {
    & {
      font-size: 12px;
      padding: 10px 10px;
    }
  }
`

const SelectBody = styled.div`
  position: absolute;
  z-index: 2900;
  bottom: -5px;
  transform: translateY(100%);
  background: white;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid rgb(164, 170, 180); 

  & button {
    display: block;
    width: 140px;
    padding: 8px;
    font-weight: 500;
  }

  @media(max-width: 400px) {
    & {
      bottom: -10px;

      button {
        padding: 8px 5px;
        width: 135px;
      }
    }
  }
`

const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 25px 0 0;
`

const Option = styled.div`
@media(hover: hover){
  &:hover{
    color: rgb(0, 156, 26);
    cursor: pointer;
  }
}`

const SelectedOption = styled.div`
  color: #009C1A;
  cursor: pointer;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 0;
  border-radius: 10px;
  overflow: hidden;
`

const Button = styled.button``

const PressedButton = styled.button`
  color: white !important;
  background: rgb(0, 156, 26);
  padding: 0 5px;
`

const VariantGroup = styled.div`
  display: flex;
  gap: 4px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgb(164, 170, 180);
  padding: 7px;
  border-radius: 8px;
`

const Variant = styled.button`
  border-radius: 10px;
  padding: 0 5px;

  @media(hover: hover) {
    &:hover {
      color: rgb(0, 156, 26)
    }
  }
`

const PressedVariant = styled.button`
  color: white !important;
  background: rgb(0, 156, 26);
  padding: 0 5px;
  border-radius: 10px;

  @media(hover: hover) {
    &:hover {
      color: rgb(0, 156, 26)
    }
  }
`

const Input = styled.input`
  border-radius: 8px;
  padding: 10px;
  max-height: 22px;
  max-width: 130px;
  outline: none;
  appearance: textfield;

  &::placeholder {
    color: #666666;
    opacity: 0.7;
    font-weight: 500;
  }
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  border-radius: 8px;
  padding: 7px;
  border: 1px solid rgb(164, 170, 180);
`

type State<T> = [T, (value: T) => void]

const useInput = <T,>({ type, placeholder = '', validator = x => x as T }:
  { type: React.HTMLInputTypeAttribute, placeholder?: string, validator?: (value: string) => T | undefined }):
  [State<T | undefined>, React.ReactElement] => {
  const [value, setValue] = useState<T>()
  const input =
    <Input
      type={type}
      placeholder={placeholder}
      value={`${value}`}
      onChange={e => setValue(validator(e.target.value))}
    />
  return [[value, setValue], input]
}

const useRangeInput = (prefix: string, postfix: string): [State<Range>, React.ReactElement] => {
  const validator = (x: string) => x === "" ? undefined : Math.max(0, +x)
  const [[from, setFrom], FromInput] = useInput<number>({ type: 'number', placeholder: `${prefix} от`, validator })
  const [[to, setTo], ToInput] = useInput<number>({ type: 'number', placeholder: "до", validator })
  const group =
    <InputGroup>
      {FromInput}
      -
      {ToInput}
      {postfix}
    </InputGroup>
  return [[[from, to], ([from, to]) => {
    setFrom(from)
    setTo(to)
  }], group]
}

const useVariantInput = <T extends string,>(variants: T[]): [State<T[]>, React.ReactElement] => {
  const [selected, setSelected] = useState<T[]>([])
  const group =
    <VariantGroup>
      {
        variants.map(x =>
          selected.includes(x)
            ? <PressedVariant
              key={x}
              onClick={() => setSelected(selected.filter(y => y !== x))}
            >
              {x}
            </PressedVariant>
            : <Variant
              key={x}
              onClick={() => setSelected([...selected, x])}
            >
              {x}
            </Variant>
        )
      }
    </VariantGroup>
  return [[selected, setSelected], group]
}

const useTabOptions = <T,>(label: string, tabs: { name: string, variants: T[] }[]): [State<T[]>, React.ReactElement] => {
  const [opened, setOpened] = useState(false)
  const [variants, setVariants] = useState<T[]>([])
  const [tab, setTab] = useState(tabs[0].name)
  return [[variants, setVariants], <>
    <SelectButton onClick={() => setOpened(!opened)}>
      {label}
      {
        opened
          ? <ChevronUpOutline height="15px" width="15px" />
          : <ChevronDownOutline height="15px" width="15px" />
      }
    </SelectButton>
    {opened &&
      <SelectBody>
        <ButtonGroup>
          {
            tabs.map(x => x.name).map(x =>
              x === tab
                ? <PressedButton key={x}>{x}</PressedButton>
                : <Button onClick={() => setTab(x)} key={x}>{x}</Button>
            )
          }
        </ButtonGroup>
        <Options>
          {
            tabs.filter(x => x.name === tab).flatMap(x => x.variants).map(x =>
              variants.includes(x)
                ? <SelectedOption onClick={() => setVariants(variants.filter(y => y !== x))} key={`${x}`}>{`${x}`}</SelectedOption>
                : <Option onClick={() => setVariants([...variants, x])} key={`${x}`}>{`${x}`}</Option>
            )
          }
        </Options>
      </SelectBody >
    }
  </>]
}


const typesMap = {
  'Дома, коттеджи, таунхаусы': ['Дом', 'Жилой дом', 'Таунхаус', 'Коттедж'],
  'Земельные участки': ['Земельный участок'],
} as const

const commercialTypesMap = {
  'Отель': ['Отель'],
  'Гостевой дом': ['Гостевой дом'],
  'Общепит': ['Ресторан', 'Кафе'],
  'Офисное помещение': ['Офисное помещение'],
  'Производственное помещение': ['Склад', 'Завод', 'База'],
  'Свободная планировка': ['Универсальное помещение']
} as const

const statusMap = {
  'Новостройки': ['Новостройки'],
  'Вторичное жилье': ['Вторичное жильё']
} as const

const mapTo = <F extends string, T>(map: { [key in F]?: readonly T[] }, list: F[]): T[] =>
  list.flatMap(x => map[x] || [])

const entries = <K extends string, V>(obj: { [key in K]: V }): [K, V][] =>
  Object.entries(obj) as any

const match = <T,>(all: readonly T[], part: readonly T[]) => part.every(x => all.includes(x))
const mapFrom = <F extends string, T>(map: { [key in F]: readonly T[] }, list: T[]): F[] =>
  entries(map).filter(x => match(list, x[1])).map(x => x[0])

export default function FiltersHeader() {
  const width = useWindowWidth()
  const filters = useFilters()
  const [[price, setPrice], PriceInput] = useRangeInput('Цена', '$')
  const [[area, setArea], AreaInput] = useRangeInput('Площадь', 'м²')
  const [[rooms, setRooms], RoomsInput] = useVariantInput([...FilterRooms])
  const [[types, setTypes], TypesInput] = useTabOptions('Тип недвижимости', [
    {
      name: 'Жилая',
      variants: ['Новостройки', 'Вторичное жилье', 'Дома, коттеджи, таунхаусы', 'Земельные участки']
    },
    {
      name: 'Коммерческая',
      variants: ['Отель', 'Гостевой дом', 'Общепит', 'Офисное помещение', 'Производственное помещение', 'Свободная планировка']
    }
  ] as const)
  useEffect(() => {
    filters.set({
      priceRange: price,
      areaRange: area,
      rooms,
      types: mapTo(typesMap, types),
      commercialTypes: mapTo(commercialTypesMap, types),
      status: mapTo(statusMap, types),
    })
  }, [...price, ...area, rooms.length, types.length])
  useEffect(() => {
    console.log('filters', filters)
    setPrice(filters.priceRange)
    setArea(filters.areaRange)
    setRooms(filters.rooms)
    setTypes([
      ...mapFrom(typesMap, filters.types),
      ...mapFrom(commercialTypesMap, filters.commercialTypes),
      ...mapFrom(statusMap, filters.status),
    ])
  }, [filters])
  return <Filters>
    <Filter>{TypesInput}</Filter>
    {width > 685 && <Filter>{PriceInput}</Filter>}
    {width > 900 && <Filter>{RoomsInput}</Filter>}
    {width > 1215 && <Filter>{AreaInput}</Filter>}
  </Filters>
}
