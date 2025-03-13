import emdash from "..";

/**
 * Options for the benchmark function
 */
interface BenchmarkOptions {
  /** Number of iterations to run each function */
  iterations?: number;
  /** Whether to warm up the functions before benchmarking */
  warmup?: boolean;
  /** Number of warmup runs (if warmup is true) */
  warmupRuns?: number;
}

/**
 * Results from a benchmark run
 */
interface BenchmarkResult {
  /** Name of the function */
  name: string;
  /** Average execution time in milliseconds */
  avg: number;
  /** Median execution time in milliseconds */
  median: number;
  /** Minimum execution time in milliseconds */
  min: number;
  /** Maximum execution time in milliseconds */
  max: number;
  /** Standard deviation of execution times */
  stdDev: number;
  /** Total execution time across all iterations */
  total: number;
  /** Operations per second */
  "ops/sec": number;
  /** Raw execution times for each iteration */
  times: number[];
}

/**
 * Benchmarks multiple functions against each other
 *
 * @param fns - An object mapping function names to functions
 * @param options - Benchmark options
 * @returns Benchmark results for each function
 */
export function benchmarkSync(
  fns: Record<string, (...args: any[]) => any>,
  options: BenchmarkOptions = {}
) {
  const iterations = options.iterations || 1000;
  const warmup = options.warmup !== false;
  const warmupRuns = options.warmupRuns || 5;

  const results: Record<string, BenchmarkResult> = {};

  // Run warmup if enabled
  if (warmup) {
    for (const [name, fn] of Object.entries(fns)) {
      for (let i = 0; i < warmupRuns; i++) {
        fn();
      }
    }
  }

  for (const [name, fn] of Object.entries(fns)) {
    const times: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const perf = emdash.performance.measure(fn);
      times.push(perf.time);
    }

    results[name] = calculateResults(name, times);
  }

  return formatBenchmarkResults(results);
}

/**
 * Options for the benchmarkAsync function
 */
interface BenchmarkAsyncOptions extends BenchmarkOptions {
  /** Whether to run async functions in parallel or sequentially */
  parallel?: boolean;
  /** Maximum concurrent executions if running in parallel */
  concurrency?: number;
}

/**
 * Benchmarks multiple async functions against each other
 *
 * @param fns - An object mapping function names to async functions
 * @param options - Benchmark options
 * @returns Promise resolving to benchmark results for each function
 */
export async function benchmark(
  fns: Record<string, (...args: any[]) => Promise<any>>,
  options: BenchmarkAsyncOptions = {}
) {
  const iterations = options.iterations || 100;
  const warmup = options.warmup !== false;
  const warmupRuns = options.warmupRuns || 3;
  const parallel = options.parallel || false;
  const concurrency = options.concurrency || 10;

  const results: Record<string, BenchmarkResult> = {};

  if (warmup) {
    for (const [name, fn] of Object.entries(fns)) {
      for (let i = 0; i < warmupRuns; i++) {
        await fn();
      }
    }
  }

  for (const [name, fn] of Object.entries(fns)) {
    const times: number[] = [];

    if (parallel) {
      for (let i = 0; i < iterations; i += concurrency) {
        const batch = Math.min(concurrency, iterations - i);
        const promises = Array.from({ length: batch }, async () => {
          const perf = await emdash.performance.measureAsync(fn);
          return perf.time;
        });

        const batchTimes = await Promise.all(promises);
        times.push(...batchTimes);
      }
    } else {
      for (let i = 0; i < iterations; i++) {
        const perf = await emdash.performance.measureAsync(fn);
        times.push(perf.time);
      }
    }

    results[name] = calculateResults(name, times);
  }

  return formatBenchmarkResults(results);
}
interface FormattedTabularData {
  name: string;
  avg: number;
  "ops/sec": number;
  min: number;
  max: number;
}

function formatBenchmarkResults(results: Record<string, BenchmarkResult>) {
  const data: FormattedTabularData[] = [];
  const headers = Object.keys(Object.values(results)[0]);

  for (const result of Object.values(results)) {
    data.push(result);
  }

  return [data, headers] as const;
}

function calculateResults(name: string, times: number[]) {
  const iterations = times.length;

  const total = emdash.math.sum(times);
  const avg = emdash.math.avg(times);
  const median = emdash.math.median(times);
  const min = emdash.math.lowest(times);
  const max = emdash.math.highest(times);

  const variance = times.reduce((sum, time) => sum + Math.pow(time - avg, 2), 0) / iterations;
  const stdDev = Math.sqrt(variance);

  const opsPerSec = 1000 / avg;

  const results = {
    name,
    avg,
    median,
    min,
    max,
    stdDev,
    total,
    "ops/sec": opsPerSec,
  };

  return Object.entries(results).reduce((acc, [key, value]) => {
    if (typeof value === "number") {
      return { ...acc, [key]: Number(value.toFixed(2)) };
    }

    return { ...acc, [key]: value };
  }, {} as BenchmarkResult);
}
