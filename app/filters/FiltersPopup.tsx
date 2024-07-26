import styled from "styled-components";
import { useState } from "react";
import { useDetectClickOutside } from "react-detect-click-outside";

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

const VariantButton = styled.button``

const PressedVariantButton = styled.button`
  color: #7f7f7f;
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

const useInput = <T,>({ type, placeholder, validator }:
  { type: React.HTMLInputTypeAttribute, placeholder: string, validator: (value: string) => T | undefined }):
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

const useRangeInputGroup = (): [number | undefined, number | undefined, React.ReactElement] => {
  const validator = (x: string) => x === "" ? undefined : +x
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

const useVariantInputGroup = <T extends string,>(variants: T[]): [T[], React.ReactElement] => {
  const [selected, setSelected] = useState<T[]>([])
  const group =
    <InputGroup>
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
      <ResetButton onClick={() => setSelected([])} >
        Сбросить
      </ResetButton>
    </InputGroup >
  return [selected, group]
}

export type Filters = {
  floorFrom?: number,
  floorTo?: number,
  areaFrom?: number,
  areaTo?: number,
}

export default function FiltersPopup({ onClose }: { onClose?: (filters: Filters) => void }) {
  const [floorFrom, floorTo, FloorInputGroup] = useRangeInputGroup()
  const [areaFrom, areaTo, AreaInputGroup] = useRangeInputGroup()
  const [types, TypesInputGroup] = useVariantInputGroup(['A', 'B', 'C'])
  const [showAllFilters, setShowAllFilters] = useState(false)
  const ref = useDetectClickOutside({
    onTriggered: () => {
      setShowAllFilters(false)
      onClose && onClose({
        floorFrom, floorTo,
        areaFrom, areaTo,
      })
    }
  })
  return (
    <Overlay>
      <Paper ref={ref}>
        <h1>Фильтры</h1>
        <FiltersContainer>
          <Filter name="Этаж">{FloorInputGroup}</Filter>
          <Filter name="Площадь">{AreaInputGroup}</Filter>
        </FiltersContainer>
        <AllFiltersButton onClick={() => setShowAllFilters(!showAllFilters)}>
          Все фильтры
        </AllFiltersButton>
        {showAllFilters && <>
          <HorizontalLine />
          <FiltersContainer>
            <Filter name="Этаж">{FloorInputGroup}</Filter>
            <Filter name="Type">{TypesInputGroup}</Filter>
          </FiltersContainer>
        </>}
      </Paper>
    </Overlay>
  )
}
