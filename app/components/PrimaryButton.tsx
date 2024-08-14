import styled from 'styled-components'

const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  color: #fff;
  height: 40px;
  padding: 0 10px;
  background: rgb(0, 156, 26);
  font-weight: 500;
  border-radius: 8px;
  margin: 20px auto 0;
  transition: .2s background-color;

  @media(hover: hover){
    &:hover{
    background-color: rgb(171, 207, 177);
    }
  }
`

export default PrimaryButton
