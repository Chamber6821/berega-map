import { Building } from "../api/berega";
import { PointsTypeOpenApi } from "../api/openApi";

export type BuildignMapStorage = {
  map: { [key: number]: Building },
  forPoint: (point: PointsTypeOpenApi) => Building | undefined,
  loadForPoint: (point: PointsTypeOpenApi) => void,
}

