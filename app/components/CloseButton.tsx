import styled from 'styled-components'

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

  @media(max-width: 720px){
  right: 41px
  }
`

export default CloseButton
