export const getPosition = (value: number, max: number, min: number) => {
  return ((value - min) / (max - min)) * 100
}
