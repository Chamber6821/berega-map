import Modal from "./components/Modal";
import Image from "next/image";

const MapboxZoomInIcon = () => <Image width={29} height={29} alt='Zoom in icon' src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23333' viewBox='0 0 29 29'%3E%3Cpath d='M14.5 8.5c-.75 0-1.5.75-1.5 1.5v3h-3c-.75 0-1.5.75-1.5 1.5S9.25 16 10 16h3v3c0 .75.75 1.5 1.5 1.5S16 19.75 16 19v-3h3c.75 0 1.5-.75 1.5-1.5S19.75 13 19 13h-3v-3c0-.75-.75-1.5-1.5-1.5z'/%3E%3C/svg%3E" />
const MapboxZoomOutIcon = () => <Image width={29} height={29} alt='Zoom out icon' src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23333' viewBox='0 0 29 29'%3E%3Cpath d='M10 13c-.75 0-1.5.75-1.5 1.5S9.25 16 10 16h9c.75 0 1.5-.75 1.5-1.5S19.75 13 19 13h-9z'/%3E%3C/svg%3E" />
const MapboxCompassIcon = () => <Image width={29} height={29} alt='Compass icon' src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23333' viewBox='0 0 29 29'%3E%3Cpath d='M10.5 14l4-8 4 8h-8z'/%3E%3Cpath id='south' d='M10.5 16l4 8 4-8h-8z' fill='%23ccc'/%3E%3C/svg%3E" />
const SelectIcon = () => <Image style={{ margin: 4 }} width={21} height={21} alt='Select area icon' src="https://img.icons8.com/glyph-neue/64/polygon.png" />

export default function HelpPopup({ onClose }: { onClose?: () => void }) {
  return (
    <Modal onClose={onClose}>
      <table>
        <tbody>
          <tr>
            <td><MapboxZoomInIcon /></td>
            <td>- приблизить карту</td>
          </tr>
          <tr>
            <td><MapboxZoomOutIcon /></td>
            <td>- отдалить карту</td>
          </tr>
          <tr>
            <td><MapboxCompassIcon /></td>
            <td>- можно вращать карту перетаскиванием, так же можно наклонять карту</td>
          </tr>
          <tr>
            <td><SelectIcon /></td>
            <td>- выделить область</td>
          </tr>
          <tr>
            <td>3D</td>
            <td>- вид карты в 3D</td>
          </tr>
        </tbody>
      </table>
    </Modal>
  )
}
