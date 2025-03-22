import { describe, it, expect } from "vitest";
import {getCoupons, calculateDiscount, validateUserInput, isPriceInRange, isValidUsername} from "../src/core.js";

describe('getCoupons', () => {
    it('should return two elements', () => {
        const coupons = getCoupons();

        expect(coupons.length).toBeGreaterThan(0);
    });

    it('should return an array with valid coupon codes', () => {
        const coupons = getCoupons();

        coupons.forEach((coupon) => {
            expect(coupon).toHaveProperty('code');
            expect(typeof coupon.code).toBe('string'); // dont need if using typescript
            expect(coupon.code).toBeTruthy();
        });
    });

    it('should return an array with valid coupon discounts', () => {
        const coupons = getCoupons();

        coupons.forEach((coupon) => {
            expect(coupon).toHaveProperty('discount');
            expect(typeof coupon.discount).toBe('number'); // dont need if using typescript
            expect(coupon.discount).toBeGreaterThan(0);
            expect(coupon.discount).toBeLessThan(1);
        });
    });
});

describe('calculateDiscount', () => {
    it('should return the discounted price if given a valid code', () => { // positive test
        expect(calculateDiscount(10, 'SAVE10')).toBe(9);
        expect(calculateDiscount(10, 'SAVE20')).toBe(8);
    });

    it('should handle non-numeric price', () => { // negative test
        expect(calculateDiscount('10', 'SAVE10')).toMatch(/invalid/i);
    });

    it('should handle negative price', () => { // negative test
        expect(calculateDiscount(-10, 'SAVE10')).toMatch(/invalid/i);
    });

    it('should handle non-string discount code', () => { // negative test
        expect(calculateDiscount(10, 10)).toMatch(/invalid/i);
    });

    it('should handle a invalid discount code', () => { // negative test
        expect(calculateDiscount(10, 'INVALID')).toBe(10);
    });
});

describe('validateUserInput', () => {
    it('should return success if given valid input', () => {
        expect(validateUserInput('nate', 20)).toMatch(/success/i);
    });

    it('should return invalid if given invalid username input', () => {
        expect(validateUserInput('a', 20)).toMatch(/invalid username/i);
        expect(validateUserInput('a'.repeat(256), 20)).toMatch(/invalid username/i);
        expect(validateUserInput(10, 20)).toMatch(/invalid username/i);
    });

    it('should return invalid if given invalid age input', () => {
        expect(validateUserInput('nate', '20')).toMatch(/invalid age/i);
        expect(validateUserInput('nate', 16)).toMatch(/invalid age/i);
        expect(validateUserInput('nate', -1)).toMatch(/invalid age/i);
        expect(validateUserInput('nate', 100)).toMatch(/invalid age/i);
    });
});

describe('isPriceInRange', () => {
    it('should return false when the price is outside the range', () => {
        expect(isPriceInRange(-10, 0, 100)).toBe(false);
        expect(isPriceInRange(120, 0, 100)).toBe(false);
    });

    it('should return true when the price is equal to the boundaries', () => { // boundary test
        expect(isPriceInRange(0, 0, 100)).toBe(true);
        expect(isPriceInRange(100, 0, 100)).toBe(true);
    });

    it('should return true when the price is within the range', () => {
        expect(isPriceInRange(50, 0, 100)).toBe(true);
    });
});

describe('isValidUsername', () => {
    it('should return false if username is outside the length range', () => {
        expect(isValidUsername('asdf', 5, 15)).toBe(false);
        expect(isValidUsername('asdf', 6, 15)).toBe(false);
    });

    it('should return true if username is equal to the length range boundaries', () => { // boundary test
        expect(isValidUsername('asdf', 4, 15)).toBe(true);
        expect(isValidUsername('asdf', 1, 4)).toBe(true);
    });

    it('should return true if username is between the length range boundaries', () => {
        expect(isValidUsername('asdfasdf', 4, 15)).toBe(true);
    });
});
