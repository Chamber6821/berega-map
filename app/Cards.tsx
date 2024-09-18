import { useEffect, useRef } from "react";
import Card from "./Card";
import { Building } from "./api/berega";

export default function Cards({ buildings, hasMore = false, showMore }:
  { buildings: Building[], hasMore?: boolean, showMore?: () => void }) {
  const endOfCards = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore) return
    const observer = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && showMore && showMore(),
      { threshold: 1 }
    );
    endOfCards.current && observer.observe(endOfCards.current)
    return () => observer.disconnect();
  }, [hasMore, showMore]);

  return (
    <div className="cards-container">
      {buildings.map((building) => (
        <Card
          key={building.page}
          image={building.image || ""}
          title={building.title}
          description={
            building.shortDescription.length === 1
              ? [building.shortDescription[0], ""]
              : building.shortDescription
          }
          page={building.page}
        />
      ))}
      <div ref={endOfCards} style={{ height: "1px", marginBottom: "20px" }}></div>
      {hasMore && <p>Загрузка...</p>}
    </div>
  );
}
