export const easeOutBounce = (x: number): number => {
  const n1 = 7.5625;
  const d1 = 2.75;
  return x < 1 / d1
    ? n1 * x * x
    : x < 2 / d1
      ? n1 * (x -= (1.5 / d1)) * x + .75
      : x < 2.5 / d1
        ? n1 * (x -= (2.25 / d1)) * x + .9375
        : n1 * (x -= (2.625 / d1)) * x + .984375;
};
