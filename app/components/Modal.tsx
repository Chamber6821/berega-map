import { CloseOutline } from "react-ionicons";
import CloseButton from "./CloseButton";
import Overlay from "./Overlay";
import Paper from "./Paper";
import { CSSProperties } from "react";

export default function Modal({ style, paperStyle, onClose, children }:
  { style?: CSSProperties, paperStyle?: CSSProperties, onClose?: () => void, children?: any }) {
  return (
    <Overlay style={style}>
      <Paper style={paperStyle}>
        <CloseButton onClick={onClose}>
          <CloseOutline color={"#050b0d"} />
        </CloseButton>
        {children}
      </Paper>
    </Overlay>
  )
}
