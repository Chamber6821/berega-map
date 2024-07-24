export const logIt = <T>(prefix: string, x: T): T => {
  console.log(prefix, x)
  return x
}

export const range = (n: number) => Array.from({ length: n }, (_, i) => i)

export const average = (numbers: number[]) => numbers.reduce((a, b) => a + b) / numbers.length

// https://stackoverflow.com/a/29915728
export const inside = (point: [number, number], polygon: [number, number][]) => {
  // ray-casting algorithm based on
  // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
  const x = point[0]
  const y = point[1];
  const vs = polygon
  let inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    var xi = vs[i][0], yi = vs[i][1];
    var xj = vs[j][0], yj = vs[j][1];

    var intersect = ((yi > y) != (yj > y))
      && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

