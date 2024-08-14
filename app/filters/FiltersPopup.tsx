import styled from 'styled-components'
import { useEffect, useState } from 'react'
import PrimaryButton from '../components/PrimaryButton'
import Modal from '../components/Modal'
import { FilterFrames, FilterGroups, FilterRooms, FilterStatuses, Range, useFilters } from './useFilters'

const Input = styled.input`
  border: 2px solid #EEF5F8;
  border-radius: 8px;
  padding: 10px;
  max-height: 33px;
  max-width: 110px;
  outline: none;
  font-weight: 500;

  &::placeholder {
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

  @media(hover: hover) {
    &:hover {
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
  <tr className='filter__line'>
    <td style={{ paddingRight: '20px' }}>
      <h2>{name}</h2>
    </td>
    <td>{children}</td>
  </tr>

type State<T> = [T, (value: T) => void]

const useInput = <T,>({ type, placeholder = '', validator = x => x as T }:
{ type: React.HTMLInputTypeAttribute, placeholder?: string, validator?: (value: string) => T | undefined }):
  [State<T | undefined>, React.ReactElement] => {
  const [value, setValue] = useState<T>()
  const input = (
    <Input
      type={type}
      placeholder={placeholder}
      value={`${value}`}
      onChange={e => setValue(validator(e.target.value))}
    />
  )
  return [[value, setValue], input]
}

const FiltersContainer = ({ children }: { children: any }) => <table><tbody>{children}</tbody></table>

const useRangeInput = (): [State<Range>, React.ReactElement] => {
  const validator = (x: string) => x === '' ? undefined : Math.max(0, +x)
  const [[from, setFrom], FromInput] = useInput<number>({ type: 'number', placeholder: 'От', validator })
  const [[to, setTo], ToInput] = useInput<number>({ type: 'number', placeholder: 'До', validator })
  const group = (
    <InputGroup>
      <div className='input-container input-container__number'>
        {FromInput}
        -
        {ToInput}
      </div>
      <ResetButton onClick={() => {
        setFrom(undefined)
        setTo(undefined)
      }}
      >
        Сбросить
      </ResetButton>
    </InputGroup>
  )
  return [[[from, to], ([from, to]) => {
    setFrom(from)
    setTo(to)
  }], group]
}

const useVariantInput = <T extends string,>(variants: T[]): [State<T[]>, React.ReactElement] => {
  const [selected, setSelected] = useState<T[]>([])
  const group = (
    <div className='input-container'>
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
  )
  return [[selected, setSelected], group]
}

const useInputText = (): [State<string>, React.ReactElement] => {
  const [[text, setText], input] = useInput<string>({ type: 'text' })
  if (text === undefined) setText('')
  const group = (
    <InputGroup>
      {input}
      <ResetButton onClick={() => setText(undefined)}>
        Сбросить
      </ResetButton>
    </InputGroup>
  )
  return [[text || '', setText], group]
}

export default function FiltersPopup ({ onClose = () => { } }: { onClose?: () => void }) {
  const [[country, setCountry], CountryInput] = useInputText()
  const [[city, setCity], CityInput] = useInputText()
  const [[groups, setGroups], TypesInput] = useVariantInput([...FilterGroups])
  const [[rooms, setRooms], RoomsInput] = useVariantInput([...FilterRooms])
  const [[status, setStatus], StatusInput] = useVariantInput([...FilterStatuses])
  const [[frame, setFrame], FrameInput] = useVariantInput([...FilterFrames])
  const [[priceRange, setPrice], PriceInput] = useRangeInput()
  const [[floorRange, setFloor], FloorInput] = useRangeInput()
  const [[areaRange, setArea], AreaInput] = useRangeInput()
  const [showAllFilters, setShowAllFilters] = useState(false)
  const filters = useFilters()
  const handleClose = () => {
    setShowAllFilters(false)
    filters.set({
      country,
      city,
      groups,
      rooms,
      status,
      frame,
      priceRange,
      floorRange,
      areaRange
    })
    onClose()
  }
  useEffect(() => {
    setCountry(filters.country || '')
    setCity(filters.city || '')
    setGroups(filters.groups)
    setRooms(filters.rooms)
    setStatus(filters.status)
    setFrame(filters.frame)
    setPrice(filters.priceRange)
    setFloor(filters.floorRange)
    setArea(filters.areaRange)
  }, [filters])
  return (
    <Modal onClose={handleClose}>
      <h1 className='filter__title'>Фильтры</h1>
      <div className='filter__table filter__first'>
        <FiltersContainer>
          {/* <Filter name="Выбор страны">{CountryInput}</Filter> */}
          {/* <Filter name="Выбор города">{CityInput}</Filter> */}
          <Filter name='Тип'>{TypesInput}</Filter>
          <Filter name='Кол-во комнат'>{RoomsInput}</Filter>
          <Filter name='Цена, $'>{PriceInput}</Filter>
        </FiltersContainer>
      </div>
      {showAllFilters && <>
        <h2 className='filter__title filter__title-more'>Дополнительные фильтры</h2>
        <div className='filter__table filter__table-more'>
          <FiltersContainer>
            <Filter name='Статус'>{StatusInput}</Filter>
            <Filter name='Этаж'>{FloorInput}</Filter>
            <Filter name='Ремонт'>{FrameInput}</Filter>
            <Filter name='Площадь, м²'>{AreaInput}</Filter>
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
