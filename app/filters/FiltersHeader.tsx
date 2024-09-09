import { useWindowWidth } from "@react-hook/window-size"
import { useEffect, useState } from "react"
import { ChevronDownOutline, ChevronUpOutline } from "react-ionicons"
import styled from "styled-components"
import { FilterGroup, FilterGroups, FilterRooms, Range, useFilters } from "./useFilters"

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
    justify-content: space-between;
    gap: 7px;
    border: 1px solid rgb(164, 170, 180);
    border-radius: 8px;
    padding: 7px 10px;
    font-weight: 500;
    width: 210px;

    @media(max-width: 360px) {
        & {
            width: 185px;
            font-size: 12px;
            padding: 10px 10px;
        }
    }
`

const SelectBody = styled.div`
    position: absolute;
    z-index: 2900;
    bottom: -5px;
    left: 0;
    right: 0;
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

const useOptions = <T,>(label: string, variants: T[]): [State<T[]>, React.ReactElement] => {
    const [opened, setOpened] = useState(false)
    const [selected, setSelected] = useState<T[]>([])
    return [[selected, setSelected], <>
        <SelectButton onClick={() => setOpened(!opened)}>
            {selected.length > 0 ? selected.join(', ') : label}
            {
                opened
                    ? <ChevronUpOutline height="15px" width="15px" />
                    : <ChevronDownOutline height="15px" width="15px" />
            }
        </SelectButton>
        {opened &&
            <SelectBody>
                <Options>
                    {
                        variants.map(x =>
                            selected.includes(x)
                                ? <SelectedOption onClick={() => setSelected(selected.filter(y => y !== x))} key={`${x}`}>{`${x}`}</SelectedOption>
                                : <Option onClick={() => setSelected([x])} key={`${x}`}>{`${x}`}</Option>
                        )
                    }
                </Options>
            </SelectBody >
        }
    </>]
}

export default function FiltersHeader() {
    const width = useWindowWidth()
    const filters = useFilters()
    const [[price, setPrice], PriceInput] = useRangeInput('Цена', '$')
    const [[area, setArea], AreaInput] = useRangeInput('Площадь', 'м²')
    const [[rooms, setRooms], RoomsInput] = useVariantInput([...FilterRooms])
    const [[types, setTypes], TypesInput] = useOptions('Тип недвижимости', [...FilterGroups])
    const [[agriculturals, setAgriculturals], AgriculturalsInput] = useVariantInput(['Сельхоз', 'Не сельхоз'] as const)
    useEffect(() => {
        const resetRooms = types.includes('Зем. участки')
        const resetAgriculturals = !types.includes('Зем. участки')
        filters.set({
            priceRange: price,
            areaRange: area,
            rooms: resetRooms ? [] : rooms,
            groups: types,
            agriculturals: resetAgriculturals ? [] : agriculturals.map(x => x === 'Сельхоз' ? true : false)
        })
    }, [...price, ...area, rooms.length, ...types, types.length, agriculturals.length])
    useEffect(() => {
        console.log('filters', filters)
        setPrice(filters.priceRange)
        setArea(filters.areaRange)
        setRooms(filters.rooms)
        setTypes(filters.groups)
        setAgriculturals(filters.agriculturals.map(x => x ? 'Сельхоз' : 'Не сельхоз'))
    }, [filters])

    // Инициализация фильтров
    useEffect(() => {
        filters.set({ groups: ['Вторичное жилье'] })
    }, [])

    return <Filters>
        <Filter>{TypesInput}</Filter>
        {width > 685 && <Filter>{PriceInput}</Filter>}
        {
            width > 900
            && types.some(x => (['Новостройки', 'Вторичное жилье'] as FilterGroup[]).includes(x))
            && < Filter > {RoomsInput}</Filter>
        }
        {
            width > 900
            && types.some(x => (['Зем. участки'] as FilterGroup[]).includes(x))
            && < Filter > {AgriculturalsInput}</Filter>
        }
        {width > 1215 && <Filter>{AreaInput}</Filter>}
    </Filters>
}