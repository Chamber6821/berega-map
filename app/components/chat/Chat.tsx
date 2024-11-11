import { CloseOutline, SendOutline } from "react-ionicons"
import styled from "styled-components"
import Logo from "../Logo"
import { useCallback, useEffect, useRef, useState } from "react"

const Popup = styled.div`
position: absolute;
top: 50%;
transform: translateY(-50%);
margin: 10px;

@media(max-width: 720px) {
  top: auto;
  bottom: 0;
  left: 0;
  right: 0;
  transform: none;
  margin: 0;
}
`

const Paper = styled.div`
padding: 18px 25px;
background-color: white;
position: relative;
z-index: 9999;
border-radius: 12px;
border-top-right-radius: 0;

@media(max-width: 720px) {
  border-radius: 12px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
`

const CloseButton = styled.button`
position: absolute;
right: 0;
top: 0;
transform: translateX(100%);
width: 40px;
height: 40px;
background-color: white;
display: flex;
justify-content: center;
align-items: center;
border-top-right-radius: 8px;
border-bottom-right-radius: 8px;

@media(max-width: 720px) {
  transform: none;
}
`

const InputGroup = styled.form`
display: flex;
width: 100%;
gap: 10px;
`

const Input = styled.input`
width: 270px;
flex-grow: 1;
justify-self: stretch;
box-shadow: -1px -1px 2px 0px #00000040, 1px 1px 2px 0px #00000040;
border-radius: 5px;
padding: 3px 8px;
`

const SendButton = styled.button`
background: #009C1A;
box-shadow: -1px -1px 2px 0px #00000040, 1px 1px 2px 0px #00000040;
border-radius: 5px;
padding: 8px;
`

const Messages = styled.div`
display: flex;
flex-direction: column;
gap: 20px;
width: 100%;
height: 300px;
overflow-y: auto;
margin-top: 10px;
margin-bottom: 20px;
`

const CenteredBackground = styled.div`
z-index: -100;
position: absolute;
transform: translate(50%, -50%);
top: 50%;
right: 50%;
`

const VerticalLayout = styled.div`
display: flex;
flex-direction: column;
align-items: center;
gap: 13px;
`

const Line = styled.div`
width: 100%;
height: 1px;
background: #009C1A;
`

const Header = () => <VerticalLayout>
  <Logo color="#009C1A" />
  <Line />
</VerticalLayout >

export default function Chat(
  {
    onSend = () => { },
    onClose = () => { },
    inputDisabled = false,
    children
  }: {
    onSend?: (message: string) => void,
    onClose?: () => void,
    inputDisabled?: boolean,
    children?: any,
  }) {
  const [input, setInput] = useState('')
  const chatBottom = useRef<HTMLDivElement>(null)
  const messageInput = useRef<HTMLInputElement>(null)
  const handleSubmit = useCallback(() => {
    if (input === '') return
    onSend(input)
    setInput('')
  }, [onSend, input, setInput])
  useEffect(() => chatBottom.current?.scrollIntoView(), [chatBottom, input, children])
  useEffect(() => { !inputDisabled && messageInput.current?.focus() }, [inputDisabled])
  return <Popup>
    <Paper>
      <CloseButton onClick={onClose}>
        <CloseOutline style={{ blockSize: 'fit-content', scale: '1.3' }} />
      </CloseButton>
      <Header />
      <Messages>
        {children}
        <div ref={chatBottom} />
      </Messages>
      <CenteredBackground>
        <Logo short color="#F1F1F1" />
      </CenteredBackground>
      <InputGroup onSubmit={e => { e.preventDefault(); handleSubmit() }}>
        <Input
          ref={messageInput}
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={inputDisabled}
        />
        <SendButton
          type="submit"
          onClick={handleSubmit}
          disabled={inputDisabled}
        >
          <SendOutline color={'#fff'} width="14px" height="14px" />
        </SendButton>
      </InputGroup>
    </Paper>
  </Popup >
}
