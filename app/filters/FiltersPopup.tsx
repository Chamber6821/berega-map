import { create } from "zustand";
import styled from "styled-components";
import { useState } from "react";

export const useFilters = create((set) => { })

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

export default function FiltersPopup() {
  const [floorFrom, floorTo, FloorInputGroup] = useRangeInputGroup()
  return (
    <Overlay>
      <Paper>
        <FiltersContainer>
          <Filter name="Фильтр">
            <InputGroup>
              <Input placeholder="От" />
              <Input placeholder="До" />
              <ResetButton>Сбросить</ResetButton>
            </InputGroup>
          </Filter>
          <Filter name="Фильтрaskdjbakjdsjdsnkdnkjsdnakjds">
            <InputGroup>
              <Input placeholder="От" />
              <Input placeholder="До" />
              <ResetButton>Сбросить</ResetButton>
            </InputGroup>
          </Filter>
          <Filter name="Этаж">{FloorInputGroup}</Filter>
        </FiltersContainer>
      </Paper>
    </Overlay>
  )
}
