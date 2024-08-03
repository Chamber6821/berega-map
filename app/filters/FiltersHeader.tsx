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

const SwitchGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0;
  border-radius: 16px;
  overflow: hidden;
`

const SwitchButton = styled.button``

const SwitchPressedButton = styled.button`
  color: white;
  background: #505050;
`

export default function FiltersHeader() {
  return <Filters>
    <Filter>
      <SelectButton>
        Фильтр 1
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
      </SelectButton>
      <SelectBody>
        <SwitchGroup>
          <SwitchPressedButton>Жилая</SwitchPressedButton>
          <SwitchButton>Коммерческая</SwitchButton>
        </SwitchGroup>
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
        Фильтр 3
      </SelectButton>
      <SelectBody>
        <SwitchGroup>
          <SwitchPressedButton>Жилая</SwitchPressedButton>
          <SwitchButton>Коммерческая</SwitchButton>
        </SwitchGroup>
        <Options>
          <Option>Вариант 1</Option>
          <Option>Вариант 2</Option>
          <SelectedOption>Правильный вриант</SelectedOption>
          <Option>Вариант 5</Option>
          <Option>Вариант 1</Option>
        </Options>
      </SelectBody>
    </Filter>
  </Filters>
}
