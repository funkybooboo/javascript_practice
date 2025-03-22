import { describe, it, expect } from "vitest";
import { getCoupons, calculateDiscount, validateUserInput } from "../src/core.js";

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
