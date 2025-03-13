/**
 * Emdash Performance Utilities
 *
 * A collection of utilities for measuring and optimizing performance
 * in JavaScript/TypeScript applications.
 */

/**
 * Measures the execution time of a function
 *
 * @param fn - The function to measure
 * @param args - Arguments to pass to the function
 * @returns Object containing the result and execution time in milliseconds
 */
export function measure<T>(fn: (...args: any[]) => T, ...args: any[]): { result: T; time: number } {
  const start = performance.now();
  const result = fn(...args);
  const end = performance.now();

  return {
    result,
    time: end - start,
  };
}

/**
 * Measures the execution time of an async function
 *
 * @param fn - The async function to measure
 * @param args - Arguments to pass to the function
 * @returns Promise resolving to object containing the result and execution time in milliseconds
 */
export async function measureAsync<T>(
  fn: (...args: any[]) => Promise<T>,
  ...args: any[]
): Promise<{ result: T; time: number }> {
  const start = performance.now();
  const result = await fn(...args);
  const end = performance.now();

  return {
    result,
    time: end - start,
  };
}
