import { describe, it, expect, beforeEach } from "vitest";
import {
    getCoupons,
    calculateDiscount,
    validateUserInput,
    isPriceInRange,
    isValidUsername,
    canDrive, fetchData, Stack
} from "../src/core.js";

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
    // it('should return false when the price is outside the range', () => {
    //     expect(isPriceInRange(-10, 0, 100)).toBe(false);
    //     expect(isPriceInRange(120, 0, 100)).toBe(false);
    // });
    //
    // it('should return true when the price is equal to the boundaries', () => { // boundary test
    //     expect(isPriceInRange(0, 0, 100)).toBe(true);
    //     expect(isPriceInRange(100, 0, 100)).toBe(true);
    // });
    //
    // it('should return true when the price is within the range', () => {
    //     expect(isPriceInRange(50, 0, 100)).toBe(true);
    // });

    it.each([ // parameterized test replaces the tests above
        { price: -10, min: 0, max: 100, result: false },
        { price: 120, min: 0, max: 100, result: false },
        { price: 0, min: 0, max: 100, result: true },
        { price: 100, min: 0, max: 100, result: true },
        { price: 50, min: 0, max: 100, result: true },
    ])('should return $result for ($price, $min, $max)', ({ price, min, max, result }) => {
        expect(isPriceInRange(price, min, max)).toBe(result);
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

describe('canDrive', () => {
    it('should return invalid if the countryCode is not registered', () => {
        expect(canDrive(18, 'FR', {US: 16, UK: 17})).toMatch(/invalid/i);
    });

    // it('should return false if they are not old enough to drive for that countryCode', () => {
    //     expect(canDrive(1, 'US', {US: 16, UK: 17})).toBe(false);
    //     expect(canDrive(3, 'UK', {US: 16, UK: 17})).toBe(false);
    // });
    //
    // it('should return true if they are just barely old enough to drive for that countryCode', () => { // boundary test
    //     expect(canDrive(16, 'US', {US: 16, UK: 17})).toBe(true);
    //     expect(canDrive(17, 'UK', {US: 16, UK: 17})).toBe(true);
    // });
    //
    // it('should return true if they are old enough to drive for that countryCode', () => {
    //     expect(canDrive(50, 'US', {US: 16, UK: 17})).toBe(true);
    //     expect(canDrive(45, 'UK', {US: 16, UK: 17})).toBe(true);
    // });

    it.each([ // parameterized tests replace the above code
        { age: 1, countryCode: 'US', legalDriveAge: { US: 16, UK: 17 }, result: false },
        { age: 3, countryCode: 'UK', legalDriveAge: { US: 16, UK: 17 }, result: false },
        { age: 16, countryCode: 'US', legalDriveAge: { US: 16, UK: 17 }, result: true },
        { age: 17, countryCode: 'UK', legalDriveAge: { US: 16, UK: 17 }, result: true },
        { age: 50, countryCode: 'US', legalDriveAge: { US: 16, UK: 17 }, result: true },
        { age: 45, countryCode: 'UK', legalDriveAge: { US: 16, UK: 17 }, result: true },
    ])('should return $result for ($age, $countryCode, $legalDriveAge)', ({ age, countryCode, legalDriveAge, result }) => {
        expect(canDrive(age, countryCode, legalDriveAge)).toBe(result);
    });
});

describe('fetchData', () => {
    it('should return an array of numbers', async () => {
        const result = await fetchData();
        expect(result.length).toBeGreaterThan(0);
    });
});

describe('Stack', () => {
    let stack;

    beforeEach(() => {
        stack = new Stack();
    });

    describe('push', () => {
        it('should add an item to the stack', () => {
            stack.push(1);

            expect(stack.size()).toBe(1);
        });

        it('should add an item to top of the stack', () => {
            stack.push(1);
            stack.push(2);

            expect(stack.size()).toBe(2);
            expect(stack.peek()).toBe(2);
        });
    });

    describe('pop', () => {
        it('should remove and return the top item from the stack', () => {
            stack.push(1);
            stack.push(2);

            expect(stack.pop()).toBe(2);
            expect(stack.size()).toBe(1);
        });

        it('should throw an error if stack is empty', () => {
            expect(stack.size()).toBe(0);
            expect(() => stack.pop()).toThrow(/empty/i);
        });
    });

    describe('peek', () => {
        it('should return the top item from the stack without removing it', () => {
            stack.push(1);
            stack.push(2);
            expect(stack.size()).toBe(2);
            expect(stack.peek()).toBe(2);
        });

        it('should throw an error if stack is empty', () => {
            expect(stack.size()).toBe(0);
            expect(() => stack.peek()).toThrow(/empty/i);
        });
    });

    describe('isEmpty', () => {
        it('should return true if the stack is empty', () => {
            expect(stack.size()).toBe(0);
            expect(stack.isEmpty()).toBe(true);
        });

        it('should return false if the stack is not empty', () => {
            stack.push(1);
            expect(stack.size()).toBe(1);
            expect(stack.isEmpty()).toBe(false);
        });
    });

    describe('size', () => {
        it('should return 0 if no items are in the stack', () => {
            expect(stack.size()).toBe(0);
        });

        it('should return the number of items in the stack', () => {
            stack.push(1);
            stack.push(1);
            stack.push(1);
            expect(stack.size()).toBe(3);
        });
    });

    describe('clear', () => {
        it('should remove all items from the stack', () => {
            stack.push(1);
            stack.push(1);
            expect(stack.size()).toBe(2);
            stack.clear();
            expect(stack.size()).toBe(0);
        });

        it('should not do anything if the stack is already empty', () => {
            expect(stack.size()).toBe(0);
            stack.clear();
            expect(stack.size()).toBe(0);
        });
    });
});
