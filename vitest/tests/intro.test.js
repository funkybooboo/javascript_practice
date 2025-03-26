import { describe, it, expect } from "vitest";
import { average, factorial, fizzBuzz, max } from "../src/intro";

// AAA
// Arrange: Turn on the TV
// Act: Press the power button
// Assert: Verify TV is off

describe("max", () => {
  it("should return the first argument if it is greater", () => {
    expect(max(2, 1)).toBe(2);
  });

  it("should return the second argument if it is greater", () => {
    expect(max(1, 2)).toBe(2);
  });

  it("should return the first argument if arguments are equal", () => {
    expect(max(1, 1)).toBe(1);
  });
});

describe("fizzBuzz", () => {
  it("should return FizzBuzz if the argument is divisible by 3 and 5", () => {
    expect(fizzBuzz(15)).toBe("FizzBuzz");
  });

  it("should return Fizz if the argument is only divisible by 3", () => {
    expect(fizzBuzz(9)).toBe("Fizz");
  });

  it("should return Buzz if the argument is only divisible by 5", () => {
    expect(fizzBuzz(10)).toBe("Buzz");
  });

  it("should return the argument as a string if the argument not is divisible by 3 or 5", () => {
    expect(fizzBuzz(2)).toBe("2");
  });
});

describe("average", () => {
  it("should return NaN if given an empty array", () => {
    expect(average([])).toBe(NaN);
  });

  it("should return the element if given an array with one element", () => {
    expect(average([2])).toBe(2);
  });

  it("should return the average of the given array with two elements", () => {
    expect(average([2, 4])).toBe(3);
  });

  it("should return the average of the given array with three elements", () => {
    expect(average([2, 4, 6])).toBe(4);
  });
});

// -n! => 1
// 0! => 1
// 1! => 1
// n! => n * factorial(n - 1)
describe("factorial", () => {
  it("should return undefined if given a negative number", () => {
    expect(factorial(-1)).toBeUndefined();
  });

  it("should return 1 if given 0", () => {
    expect(factorial(0)).toBe(1);
  });

  it("should return 1 if given 1", () => {
    expect(factorial(1)).toBe(1);
  });

  it("should return 2 if given 2", () => {
    expect(factorial(2)).toBe(2);
  });

  it("should return 6 if given 3", () => {
    expect(factorial(3)).toBe(6);
  });

  it("should return the product of all positive integers starting from 1 to n", () => {
    expect(factorial(6)).toBe(720);
  });
});
