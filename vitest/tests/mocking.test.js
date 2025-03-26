import { vi, it, expect, describe } from 'vitest';
import { getPriceInCurrency, getShippingInfo } from "../src/mocking.js";
import { getExchangeRate } from "../src/libs/currency.js";
import {getShippingQuote} from "../src/libs/shipping.js";

vi.mock('../src/libs/currency');

describe('getPriceInCurrency', () => {
    it('should return price in target currency', () => {
        vi.mocked(getExchangeRate).mockReturnValue(1.5);

        const price = getPriceInCurrency(10, 'AUD');

        expect(getExchangeRate).toHaveBeenCalledTimes(1);
        expect(getExchangeRate).toHaveBeenCalledWith('USD', 'AUD');
        expect(getExchangeRate).toHaveReturned(1.5);
        expect(price).toBe(15);
    });
});

vi.mock('../src/libs/shipping');

describe('getShippingInfo', () => {
    it('should return the shipping info when a quote is fetched', () => {
        vi.mocked(getShippingQuote).mockReturnValue({ cost: 1, estimatedDays: 1 });

        const info = getShippingInfo('Test');

        expect(getShippingQuote).toHaveBeenCalledWith('Test');
        expect(getShippingQuote).toHaveReturned({ cost: 1, estimatedDays: 1 });
        expect(info).toMatch(/\$1/i);
        expect(info).toMatch(/1 days/i);
    });

    it('should return shipping unavailable if quote cannot be fetched', () => {
        vi.mocked(getShippingQuote).mockReturnValue(null);

        const info = getShippingInfo('Test');

        expect(getShippingQuote).toHaveBeenCalledWith('Test');
        expect(getShippingQuote).toHaveReturned(null);
        expect(info).toMatch(/unavailable/i);
    });
});
