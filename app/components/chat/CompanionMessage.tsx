import styled from "styled-components"

const Box = styled.div`
background: #009C1A;
align-self: flex-start;
border-radius: 5px;
padding: 7px 12px;
max-width: 200px;
text-wrap: wrap;
overflow-wrap: break-word;
font-size: 10px;
color: #FFFFFF;
`

export default function CompanionMessage({ children }: { children?: any }) {
  return <Box>{children}</Box>
}
