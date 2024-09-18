import { useEffect, useState } from "react"
import styled from "styled-components"
import { FilterApies, useFilters } from "./useFilters"

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

const VariantGroup = styled.div`
  display: flex;
  gap: 4px;
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

const Filter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 70px;
  left: 5px;
  z-index: 999;
  background: #fff;
  padding: 10px;
  border-radius: 8px;
  width: fit-content;
  font-weight: 500;
  gap: 10px;

  @media(max-width: 360px) {
    & {
      top: 0;
      left: 0;
      flex-direction: row;
      position: relative;
      width: 305px;
      font-size: 12px;
      padding: 0 0 10px 10px;
      gap: 0px;
    }
  }
`

type State<T> = [T, (value: T) => void]

const useSwitchInput = <T extends string,>(prefix : string, variants: T[]): [State<T>, React.ReactElement] => {
  const [selected, setSelected] = useState<T>(variants[0]);

  const handleSelect = (value: T) => {
    if (value === selected) return;
    setSelected(value);
  };

  const group = (
    <>
      <h2 style={{width: 'fit-content'}}>{prefix}</h2>
      <VariantGroup>
        {variants.map((x) =>
          x === selected ? (
            <PressedVariant key={x} onClick={() => handleSelect(x)}>
              {x}
            </PressedVariant>
          ) : (
            <Variant key={x} onClick={() => handleSelect(x)}>
              {x}
            </Variant>
          )
        )}
      </VariantGroup>
    </>
  );

  return [[selected, setSelected], group];
};

export default function FilterApi() {
  const [[api, setApi], ApiInput] = useSwitchInput('Api недвижимости', [...FilterApies])
  const filters = useFilters()
  useEffect(() => {
    filters.set({
        api: api
    })
  }, [api]);
  useEffect(() => {
    setApi(filters.api);
  }, [filters]);
  return <Filter>{ApiInput}</Filter>
}