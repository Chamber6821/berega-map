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

export type Color = {
  r: number,
  g: number,
  b: number,
}

export const colorFromHex = (hex: string): Color => {
  const trimmed = hex.replaceAll('#', '')
  return {
    r: parseInt(trimmed.substring(0, 2), 16),
    g: parseInt(trimmed.substring(2, 4), 16),
    b: parseInt(trimmed.substring(4, 6), 16),
  }
}

export const colorToHex = (color: Color) => {
  const r = Math.floor(color.r)
  const g = Math.floor(color.g)
  const b = Math.floor(color.b)
  return (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)
}

export const gradient = (colorFrom: Color, colorTo: Color) => (progress: number) =>
({
  r: colorFrom.r * (1 - progress) + colorTo.r * progress,
  g: colorFrom.g * (1 - progress) + colorTo.g * progress,
  b: colorFrom.b * (1 - progress) + colorTo.b * progress,
})

export const clamp = (x: number, min: number, max: number) => Math.max(min, Math.min(x, max))

