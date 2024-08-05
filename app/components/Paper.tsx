import styled from "styled-components";

const Paper = styled.div`
  width: 80%;
  margin: 20px auto 20px;
  padding: 20px;
  background-color: white;
  position: relative;
  z-index: 9999;
  border-radius: 12px;
  border-top-right-radius: 0;

  @media(max-width: 720px){
    border-top-right-radius: 12px;
    width: 95%;
    padding: 20px 15px;
  }
`

export default Paper

