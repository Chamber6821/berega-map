import { ChevronDownOutline, ChevronUpOutline } from "react-ionicons"
import styled from "styled-components"

const Filter = styled.div`
  position: relative;
  z-index: 9999;
`

const Filters = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`

const SelectButton = styled.button``

const SelectBody = styled.div`
  position: absolute;
  bottom: 0;
  transform: translateY(100%);
  background: white;
  padding: 10px;
  border-radius: 16px;
  border: 1px solid black; /* временно, что бы визуально отличать блоки */ 
`

const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const Option = styled.div``

const SelectedOption = styled.div`
  color: #009C1A;
`

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0;
  border-radius: 16px;
  overflow: hidden;
`

const Button = styled.button``

const PressedButton = styled.button`
  color: white;
  background: #505050;
`

const Input = styled.input`
  border: 2px solid #EEF5F8;
  border-radius: 8px;
  padding: 10px;
  max-height: 33px;
  max-width: 110px;
  outline: none;

  &:focus {
    border: 2px solid #009C1A;
    box-shadow: 0px 5px 10px 2px rgba(0, 156, 26, 0.2);
  }

  &::placeholder {
    color: #666666;
    opacity: 0.7;
    font-size: 12px;
    font-weight: 600;
  }
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
export default function FiltersHeader() {
  return <Filters>
    <Filter>
      <SelectButton>
        Фильтр 1
        <ChevronDownOutline />
      </SelectButton>
      <SelectBody>
        <Options>
          <Option>Вариант 1</Option>
          <Option>Вариант 2</Option>
          <SelectedOption>Правильный вриант</SelectedOption>
          <Option>Вариант 5</Option>
          <Option>Вариант 1</Option>
        </Options>
      </SelectBody>
    </Filter>
    <Filter>
      <SelectButton>
        Фильтр 2
        <ChevronUpOutline />
      </SelectButton>
      <SelectBody>
        <ButtonGroup>
          <PressedButton>Жилая</PressedButton>
          <Button>Коммерческая</Button>
        </ButtonGroup>
        <Options>
          <Option>Вариант 1</Option>
          <Option>Вариант 2</Option>
          <SelectedOption>Правильный вриант</SelectedOption>
          <Option>Вариант 5</Option>
          <Option>Вариант 1</Option>
        </Options>
      </SelectBody>
    </Filter>
    <Filter>
      <InputGroup>
        <Input placeholder="Цена от" />
        <Input placeholder="до" />
        {/* <ResetButton>Сбросить</ResetButton> */} {/* В принципе можно без кнопки сброса */}
      </InputGroup>
    </Filter>
    <Filter>
      <ButtonGroup>
        <PressedButton>Студия</PressedButton>
        <Button>1</Button>
        <Button>2</Button>
        <Button>3</Button>
        <Button>4+</Button>
      </ButtonGroup>
    </Filter>
    <Filter>
      <InputGroup>
        <Input placeholder="Площадь от" />
        <Input placeholder="до" />
        {/* <ResetButton>Сбросить</ResetButton> */} {/* В принципе можно без кнопки сброса */}
      </InputGroup>
    </Filter>
  </Filters>
}
