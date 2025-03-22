import { isEven } from "./math";

describe("isEven", () => {
    it("should return true if given an even number", () => {
        const result = isEven(2); // Function under test (SUT)
        expect(result).toEqual(true); // toEqual is a matcher
    });

    it("should return false if given an odd number", () => {
        const result = isEven(1);
        expect(result).toEqual(false);
    });
});
