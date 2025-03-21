import { describe, it, expect } from "vitest";
import {calculateAverage, fizzBuzz, max} from "../src/intro"

// AAA
// Arrange: Turn on the TV
// Act: Press the power button
// Assert: Verify TV is off

describe('max', () => {
    it('should return the first argument if it is greater', () => {
        expect(max(2, 1)).toBe(2);
    });

    it('should return the second argument if it is greater', () => {
        expect(max(1, 2)).toBe(2);
    });

    it('should return the first argument if arguments are equal', () => {
        expect(max(1, 1)).toBe(1);
    });
});

describe('fizzBuzz', () => {
    it('should return FizzBuzz if the argument is divisible by 3 and 5', () => {
        expect(fizzBuzz(15)).toBe("FizzBuzz");
    });

    it('should return Fizz if the argument is only divisible by 3', () => {
        expect(fizzBuzz(9)).toBe("Fizz");
    });

    it('should return Buzz if the argument is only divisible by 5', () => {
        expect(fizzBuzz(10)).toBe("Buzz");
    });

    it('should return the argument as a string if the argument not is divisible by 3 or 5', () => {
        expect(fizzBuzz(2)).toBe("2");
    });
});

describe('calculateAverage', () => {
    it('should return NaN if given an empty array', () => {
        expect(calculateAverage([])).toBe(NaN);
    });

    it('should return the element if given an array with one element', () => {
        expect(calculateAverage([2])).toBe(2);
    });

    it('should return the average of the given array with two elements', () => {
        expect(calculateAverage([2, 4])).toBe(3);
    });

    it('should return the average of the given array with three elements', () => {
        expect(calculateAverage([2, 4, 6])).toBe(4);
    });

});
