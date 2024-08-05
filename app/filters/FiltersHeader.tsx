import { useWindowWidth } from "@react-hook/window-size"
import { ChevronUpOutline } from "react-ionicons"
import styled from "styled-components"

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
  padding: 5px 10px;
  font-weight: 500;

  @media(max-width: 400px) {
    & {
      font-size: 10px;
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
    padding: 10px;
    font-weight: 500;
  }

  @media(max-width: 400px) {
    & {
      font-size: 10px;
      bottom: -10px;

      button {
        padding: 5px;
        width: 100px;
      }
    }
  }
`

const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 0 0;
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

const Input = styled.input`
  border-radius: 8px;
  padding: 10px;
  max-height: 22px;
  max-width: 130px;
  outline: none;

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
  padding: 5px;
  border: 1px solid rgb(164, 170, 180);
`

export default function FiltersHeader() {
  const width = useWindowWidth()
  return <Filters>
    <Filter>
      <SelectButton>
        Тип недвижимости
        <ChevronUpOutline
          height="15px"
          width="15px" />
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
    {width > 685 &&
      <Filter>
        <InputGroup>
          <Input placeholder="Цена от" />
          -
          <Input placeholder="до" />
          $
        </InputGroup>
      </Filter>
    }
    {width > 900 &&
      <Filter>
        <ButtonGroup>
          <PressedButton>Студия</PressedButton>
          <Button>1</Button>
          <Button>2</Button>
          <Button>3</Button>
          <Button>4</Button>
          <Button>5+</Button>
        </ButtonGroup>
      </Filter>
    }
    {width > 1215 &&
      <Filter>
        <InputGroup>
          <Input placeholder="Площадь от" />
          -
          <Input placeholder="до" />
          м²
        </InputGroup>
      </Filter>
    }
  </Filters>
}
