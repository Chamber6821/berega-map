import styled from "styled-components"

const Box = styled.div`
background: #C7C7C7;
align-self: flex-end;
border-radius: 5px;
padding: 7px 12px;
max-width: 200px;
text-wrap: wrap;
overflow-wrap: break-word;
font-size: 14px;
color: #FFFFFF;
`

export default function MyMessage({ children }: { children?: any }) {
  return <Box>{children}</Box>
}
