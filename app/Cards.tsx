import { useEffect, useMemo, useRef, useState } from "react";
import Card from "./Card";
import { Building } from "./api/berega";
import { PointsTypeOpenApi, fetchBuilding } from "@/app/api/openApi";

interface CardsProps {
  buildings: Building[];
  points: PointsTypeOpenApi[];
}

export default function Cards({ buildings, points }: CardsProps) {
  const [visibleBuildings, setVisibleBuildings] = useState<Building[]>([]);
  const [loadedBuildingsFromPoints, setLoadedBuildingsFromPoints] = useState<Building[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const lastCardRef = useRef<HTMLDivElement>(null);

  const ITEMS_PER_BATCH = 10;
  const loadedBuildingCountRef = useRef(0);
  const loadedPointsCountRef = useRef(0);

  const loadMoreItems = async () => {
    const currentLoadedBuildingCount = loadedBuildingCountRef.current;
    const currentLoadedPointsCount = loadedPointsCountRef.current;

    const nextBuildings = buildings.slice(
      currentLoadedBuildingCount,
      currentLoadedBuildingCount + ITEMS_PER_BATCH
    );
    const nextPoints = points.slice(
      currentLoadedPointsCount,
      currentLoadedPointsCount + ITEMS_PER_BATCH
    );


    const nextLoadedBuildings = await Promise.all(
      nextPoints.map((point) => fetchBuilding(point.id))
    );

    setVisibleBuildings((prevBuildings) => [
      ...prevBuildings,
      ...nextBuildings,
    ]);
    setLoadedBuildingsFromPoints((prevLoaded) => [
      ...prevLoaded,
      ...nextLoadedBuildings,
    ]);

    loadedBuildingCountRef.current += nextBuildings.length;
    loadedPointsCountRef.current += nextPoints.length;

    if (nextBuildings.length === 0 && nextLoadedBuildings.length === 0) {
      setHasMore(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreItems();
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
  }, [hasMore]);

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

      <div ref={lastCardRef} style={{height: "1px", marginBottom: "20px"}}></div>
      {hasMore && <p>Загрузка...</p>}
    </div>
  );
}
