// Lesson: Writing your first tests
export function max(a, b) {
  return a > b ? a : b;
}

// Exercise
export function fizzBuzz(n) {
  if (n % 3 === 0 && n % 5 === 0) return "FizzBuzz";
  if (n % 3 === 0) return "Fizz";
  if (n % 5 === 0) return "Buzz";
  return n.toString();
}

export function average(ns) {
  if (ns.length === 0) return NaN;
  if (ns.length === 1) return ns[0];
  const sum = ns.reduce((sum, current) => sum + current, 0);
  return sum / ns.length;
}

export function factorial(n) {
  if (n < 0) return undefined;
  if (n < 2) return 1;
  return n * factorial(n - 1);
}
