import { Padding } from "@maptiler/sdk";
import Modal from "./components/Modal";
import Image from "next/image";

const MapboxZoomInIcon = () => <Image width={29} height={29} alt='Zoom in icon' src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23333' viewBox='0 0 29 29'%3E%3Cpath d='M14.5 8.5c-.75 0-1.5.75-1.5 1.5v3h-3c-.75 0-1.5.75-1.5 1.5S9.25 16 10 16h3v3c0 .75.75 1.5 1.5 1.5S16 19.75 16 19v-3h3c.75 0 1.5-.75 1.5-1.5S19.75 13 19 13h-3v-3c0-.75-.75-1.5-1.5-1.5z'/%3E%3C/svg%3E" />
const MapboxZoomOutIcon = () => <Image width={29} height={29} alt='Zoom out icon' src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23333' viewBox='0 0 29 29'%3E%3Cpath d='M10 13c-.75 0-1.5.75-1.5 1.5S9.25 16 10 16h9c.75 0 1.5-.75 1.5-1.5S19.75 13 19 13h-9z'/%3E%3C/svg%3E" />
const MapboxCompassIcon = () => <Image width={29} height={29} alt='Compass icon' src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23333' viewBox='0 0 29 29'%3E%3Cpath d='M10.5 14l4-8 4 8h-8z'/%3E%3Cpath id='south' d='M10.5 16l4 8 4-8h-8z' fill='%23ccc'/%3E%3C/svg%3E" />
const SelectIcon = () => <Image style={{ margin: 4 }} width={21} height={21} alt='Select area icon' src="https://img.icons8.com/glyph-neue/64/polygon.png" />

export default function HelpPopup({ onClose }: { onClose?: () => void }) {
  return (
    <Modal onClose={onClose}>
      <table className="helpPopup__table">
        <tbody>
          <tr>
            <td><MapboxZoomInIcon /></td>
            <td>- приблизить карту.</td>
          </tr>
          <tr>
            <td><MapboxZoomOutIcon /></td>
            <td>- отдалить карту.</td>
          </tr>
          <tr>
            <td><MapboxCompassIcon /></td>
            <td>- можно вращать карту перетаскиванием, так же можно наклонять карту.</td>
          </tr>
          <tr>
            <td><SelectIcon /></td>
            <td>- выделить определенную область.</td>
          </tr>
          <tr>
            <td>2D</td>
            <td>- вид карты в 2D.</td>
          </tr>
          <tr>
            <td>3D</td>
            <td>- вид карты в 3D.</td>
          </tr>
        </tbody>
      </table>
      <div style={{
            padding: '10px 0',
            width: '100%',
          }}><strong>Обозначение палитры маркеров недвижимости на карте</strong></div>
      <table>
        <tbody style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          width: '100%',
        }}>
          <tr style={{
              display: 'flex',
              alignItems: 'flex-start',
              columnGap: '10px',
          }}>
            <td style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              minWidth: '150px',
              maxWidth: '150px',
            }}>Новостройки <span style={{
              display: 'block',
              marginLeft: '5px',
              padding: '10px',
              borderRadius: '50%',
              background: '#0000ff',
            }}></span></td>
            <td>- синим цветом обозначаются новостройки (первичное жилье), цвет никогда не изменяется.</td>
          </tr>
          <tr style={{
              display: 'flex',
              alignItems: 'flex-start',
              columnGap: '10px',
          }}>
            <td style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              minWidth: '150px',
              maxWidth: '150px',
            }}>Вторичное жилье <span style={{
              display: 'block',
              marginLeft: '5px',
              padding: '10px',
              borderRadius: '50%',
              background: '#009c1a',
            }}></span></td>
            <td>- зеленым цветом обозначаются объекты вторичного жилья, цвет бледнеет в течение месяца с момента размещения.</td>
          </tr>
          <tr style={{
              display: 'flex',
              alignItems: 'flex-start',
              columnGap: '10px',
          }}>
            <td style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              minWidth: '150px',
              maxWidth: '150px',
            }}>Дома, коттеджи, танхаусы<span style={{
              display: 'block',
              marginLeft: '5px',
              padding: '10px',
              borderRadius: '50%',
              background: '#8000FF',
            }}></span></td>
            <td>- этот тип недвижимости обозначается фиолетовым цветом, цвет бледнеет в течение 3-ех месяцев с момента размещения.</td>
          </tr>
          <tr style={{
              display: 'flex',
              alignItems: 'flex-start',
              columnGap: '10px',
          }}>
            <td style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              minWidth: '150px',
              maxWidth: '150px',
            }}>Земельные участки <span style={{
              display: 'block',
              marginLeft: '5px',
              padding: '10px',
              borderRadius: '50%',
              background: '#FFFF00',
            }}></span></td>
            <td>- земельные участки обозначаются желтым цветом, цвет бледнеет в течение 6-ти месяцев.</td>
          </tr>
          <tr style={{
              display: 'flex',
              alignItems: 'flex-start',
              columnGap: '10px',
          }}>
            <td style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              minWidth: '150px',
              maxWidth: '150px',
            }}>Коммерция <span style={{
              display: 'block',
              marginLeft: '5px',
              padding: '10px',
              borderRadius: '50%',
              background: '#FF0000',
            }}></span></td>
            <td>- коммерческая недвижимость обозначается красным цветом, цвет никогда не изменяется.</td>
          </tr>
        </tbody>
      </table>
    </Modal>
  )
}
