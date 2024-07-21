export const logIt = <T>(prefix: string, x: T): T => {
  console.log(prefix, x)
  return x
}

export const average = (numbers: number[]) => numbers.reduce((a, b) => a + b) / numbers.length

