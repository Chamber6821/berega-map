import { CloseOutline } from 'react-ionicons'
import CloseButton from './CloseButton'
import Overlay from './Overlay'
import Paper from './Paper'
import { CSSProperties, useEffect, useRef } from 'react'

const useOnClickOutside = (ref: { current: HTMLElement | null }, handler: () => void) => {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const container = ref.current
      if ((container != null) && !container.contains(e.target as HTMLElement)) { handler() }
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [ref, handler])
}

export default function Modal ({ style, paperStyle, onClose, children }:
{ style?: CSSProperties, paperStyle?: CSSProperties, onClose?: () => void, children?: any }) {
  const ref = useRef<HTMLDivElement>(null)
  useOnClickOutside(ref, (onClose != null) || (() => { }))
  return (
    <Overlay style={style}>
      <Paper ref={ref} style={paperStyle}>
        <CloseButton onClick={onClose}>
          <CloseOutline color='#050b0d' />
        </CloseButton>
        {children}
      </Paper>
    </Overlay>
  )
}
