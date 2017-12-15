/**
 * Returns true iff a transform value is "essentially" a specified basis int.
 */
export const transformValueIsEssentiallyInt =
  (transformValue: number, basis: number): boolean => Math.abs(transformValue - basis) < 1e-6;
