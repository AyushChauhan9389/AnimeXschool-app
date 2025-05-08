export function calculateOffPercentage(price: string, regular_price: string) {
  return Math.round(
    ((Number(regular_price) - Number(price)) / Number(regular_price)) * 100,
  );
}
