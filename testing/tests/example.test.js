import { describe, it, expect } from "vitest";

describe('test suite', () => {
    it('test case', () => {
        const r = { name: 'Nate' };
        // expect(r).toBe({ name: 'Nate' }); // Fails as they are different objects
        expect(r).toEqual({ name: 'Nate' });
    });

    it('test case', () => {
        const r = 'The requested file was not found.';
        // expect(r).toBeDefined(); // Loose (too general)
        // expect(r).toBe('The requested file was not found.'); // Tight (too specific) i.e., what if we remove the period
        expect(r).toMatch('not found'); // Better assertion we at least need to say not found if a file is not found. That keyword is not likely to change.
    });

    it('test case', () => {
        const r = [1, 2, 3];
        // expect(r).toBeDefined(); // Loose
        // expect(r).toEqual([1, 2, 3]); // Tight we don't want to be order-dependent
        // expect(r).toEqual(expect.arrayContaining([1, 2, 3])); // Better as now order does not matter
        expect(r.length).toBeGreaterThan(0); // Maybe loose or could be good, depends on your use case!
        expect(r).toHaveLength(3); // Maybe tight or could be good, depends on your use case!
    });

    it('test case', () => {
        const r = { name: 'Nate' };
        // expect(r).toEqual({ name: 'Nate' }); // Tight what if we add an id property to r
        // expect(r).toMatchObject({ name: 'Nate' }); // match on a subset of attributes. this can be night tho as we are making an assertion on the value
        expect(r).toHaveProperty('name');
    });
});
