import { useEffect, useRef, useState } from "react";
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
  const observer = useRef<IntersectionObserver | null>(null);
  const lastCardRef = useRef<HTMLDivElement | null>(null);

  const ITEMS_PER_BATCH = 10;
  const loadedBuildingCountRef = useRef(0);
  const loadedPointsCountRef = useRef(0);

  useEffect(() => {
  }, [buildings, points]);


  const loadInitialItems = async () => {
    const initialBuildings = buildings.slice(0, ITEMS_PER_BATCH);
    const uniqueBuildings = initialBuildings.filter(
        (newBuilding) => !visibleBuildings.some((existingBuilding) => existingBuilding.page === newBuilding.page)
    );
    if (uniqueBuildings.length > 0) {
      setVisibleBuildings((prevBuildings) => [...prevBuildings, ...uniqueBuildings]);
      loadedBuildingCountRef.current += uniqueBuildings.length;
    }
    const initialPoints = points.slice(0, ITEMS_PER_BATCH);
    const loadedBuildingsFromPoints = await Promise.all(
        initialPoints.map((point) => fetchBuilding(point.id))
    );
    const uniqueBuildingsFromPoints = loadedBuildingsFromPoints.filter(
        (newBuilding) => !loadedBuildingsFromPoints.some((existingBuilding) => existingBuilding.page === newBuilding.page)
    );
    if (uniqueBuildingsFromPoints.length > 0) {
      setLoadedBuildingsFromPoints((prevLoaded) => [
        ...prevLoaded,
        ...uniqueBuildingsFromPoints,
      ]);
      loadedPointsCountRef.current += uniqueBuildingsFromPoints.length;
    }
  };

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
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            loadMoreItems();
          }
        },
        { threshold: 1 }
    );

    if (lastCardRef.current) {
      observer.current.observe(lastCardRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [hasMore]);

  return (
      <div className="cards-container">
        {visibleBuildings.map((building, index) => (
            <Card
                key={`building-${index}`}
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

        {loadedBuildingsFromPoints.map((building, index) => (
            <Card
                key={`point-${index}`}
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
