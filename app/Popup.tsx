import Image from "next/image";
import { Building } from "./api/berega";
import { CloseOutline } from "react-ionicons";
import PrimaryButton from "./components/PrimaryButton";

export default function Popup({ building, onClose }: { building: Building, onClose?: () => unknown }) {
  return <div className="popup-container">
    <div className="popup">
      <button className="close" onClick={onClose}>
        <div style={{ blockSize: 'fit-content', scale: '1.3' }}>
          <CloseOutline />
        </div>
      </button>
      <div className="content">
        <Image
          className="image"
          src={building.image || ''}
          alt={building.title}
          width={300}
          height={250}
          objectFit="contain"
        />
        <div className="content__wrraper">
          <h1 style={{ marginTop: '10px' }}>{building.title}</h1>
          <p style={{ marginBottom: '10px' }}>{building.location.address}</p>
          <div className="popup__description flex-column">
            {
              building.description.map(x =>
                <div key={x[0] + x[1]} className="group">
                  <p>{x[0]}</p>
                  <p className="price">{x[1]}</p>
                </div>)
            }
          </div>
        </div>
        <div className="popup__btn">
          <PrimaryButton onClick={() => window.open(building.page, '_blank')}>Подробнее</PrimaryButton>
        </div>
      </div>
    </div>
  </div>
}
