import { useEffect, useMemo, useRef } from "react";
import Card from "./Card";
import { Building } from "./api/berega";
import { PointsTypeOpenApi } from "@/app/api/openApi";
import { useBuildings } from "./useBuildings";

interface CardsProps {
  buildings: Building[];
  points: PointsTypeOpenApi[];
}

export default function Cards({ buildings, points }: CardsProps) {
  const lastCardRef = useRef<HTMLDivElement>(null);
  const { buildings: visibleBuildings, loadedBuildingsFromPoints, hasMore, loadMoreItems } = useBuildings();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreItems(buildings, points);
        }
      },
      { threshold: 1 }
    );
    if (lastCardRef.current) {
      observer.observe(lastCardRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [hasMore, buildings, points, loadMoreItems]);

  const combinedBuildings = useMemo(
    () => [...visibleBuildings, ...loadedBuildingsFromPoints],
    [visibleBuildings, loadedBuildingsFromPoints]
  );

  return (
    <div className="cards-container">
      {combinedBuildings.map((building) => (
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
      <div ref={lastCardRef} style={{ height: "1px", marginBottom: "20px" }}></div>
      {hasMore && <p>Загрузка...</p>}
    </div>
  );
}