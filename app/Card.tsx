"use client"

import Image from "next/image";
import { Heart, HeartOutline } from "react-ionicons";

export default function Card({ image, title, description, page }:
  { image: string, title: string, description: [string, string], page: string }) {
  return <a
    href={page}
    style={{ textDecoration: "none" }}
    target="_blank"
  >
    <div className="building">
      <Image src={image} alt={title} width={300} height={140} />
      <button className="like">
        <div style={{ scale: 1.4 }}>
          <HeartOutline
            cssClasses="not-liked"
            color="#e94e51"
            aria-label="Favorite" />
          <Heart
            cssClasses="liked"
            color="#e94e51"
            aria-label="Favorite" />
        </div>
      </button>
      <div className="body">
        <h1>{title}</h1>
        <div className="flex-column">
          <div className="group">
            <p>{description[0]}</p>
            <p className="price">{description[1]}</p>
          </div>
        </div>
      </div>
    </div>
  </a>
}
