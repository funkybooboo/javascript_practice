import { vi, it, expect, describe } from "vitest";
import {
  getDiscount,
  getPriceInCurrency,
  getShippingInfo,
  isOnline,
  login,
  renderPage,
  signUp,
  submitOrder,
} from "../src/mocking.js";
import { getExchangeRate } from "../src/libs/currency.js";
import { getShippingQuote } from "../src/libs/shipping.js";
import { trackPageView } from "../src/libs/analytics.js";
import { charge } from "../src/libs/payment.js";
import { sendEmail } from "../src/libs/email.js";
import security from "../src/libs/security.js";

vi.mock("../src/libs/currency");

describe("getPriceInCurrency", () => {
  it("should return price in target currency", () => {
    vi.mocked(getExchangeRate).mockReturnValue(1.5);

    const price = getPriceInCurrency(10, "AUD");

    expect(getExchangeRate).toHaveBeenCalledTimes(1);
    expect(getExchangeRate).toHaveBeenCalledWith("USD", "AUD");
    expect(getExchangeRate).toHaveReturned(1.5);
    expect(price).toBe(15);
  });
});

vi.mock("../src/libs/shipping");

describe("getShippingInfo", () => {
  it("should return the shipping info when a quote is fetched", () => {
    vi.mocked(getShippingQuote).mockReturnValue({ cost: 1, estimatedDays: 1 });

    const info = getShippingInfo("Test");

    expect(getShippingQuote).toHaveBeenCalledTimes(1);
    expect(getShippingQuote).toHaveBeenCalledWith("Test");
    expect(getShippingQuote).toHaveReturned({ cost: 1, estimatedDays: 1 });
    expect(info).toMatch(/\$1/i);
    expect(info).toMatch(/1 days/i);
  });

  it("should return shipping unavailable if quote cannot be fetched", () => {
    vi.mocked(getShippingQuote).mockReturnValue(null);

    const info = getShippingInfo("Test");

    expect(getShippingQuote).toHaveBeenCalledTimes(1);
    expect(getShippingQuote).toHaveBeenCalledWith("Test");
    expect(getShippingQuote).toHaveReturned(null);
    expect(info).toMatch(/unavailable/i);
  });
});

vi.mock("../src/libs/analytics");

describe("renderPage", () => {
  it("should return the pages content", async () => {
    vi.mocked(trackPageView);

    const content = await renderPage();

    expect(trackPageView).toHaveBeenCalledTimes(1);
    expect(trackPageView).toHaveBeenCalledWith("/home");
    expect(trackPageView).toHaveReturned(undefined);
    expect(content).toMatch(/content/i);
  });
});

vi.mock("../src/libs/payment");

describe("submitOrder", () => {
  it("should return success true given a valid order and credit card", async () => {
    vi.mocked(charge).mockResolvedValue({ status: "success" });
    const order = { totalAmount: 12 };
    const creditCard = { creditCardNumber: 1234 };

    const response = await submitOrder(order, creditCard);

    expect(charge).toBeCalledTimes(1);
    expect(charge).toHaveBeenCalledWith(creditCard, 12);
    expect(charge).toHaveReturned({ status: "success" });
    expect(response).toHaveProperty("success");
    expect(response.success).toBe(true);
  });

  it("should return success false given an invalid order", async () => {
    vi.mocked(charge).mockResolvedValue({ status: "failed" });
    const order = {};
    const creditCard = { creditCardNumber: 1234 };

    const response = await submitOrder(order, creditCard);

    expect(charge).toBeCalledTimes(1);
    expect(charge).toHaveBeenCalledWith(creditCard, undefined);
    expect(charge).toHaveReturned({ status: "failed" });
    expect(response).toHaveProperty("success");
    expect(response.success).toBe(false);
    expect(response).toHaveProperty("error");
    expect(response.error).toMatch(/error/i);
  });

  it("should return success false given an invalid credit card", async () => {
    vi.mocked(charge).mockResolvedValue({ status: "failed" });
    const order = { totalAmount: 12 };
    const creditCard = {};

    const response = await submitOrder(order, creditCard);

    expect(charge).toBeCalledTimes(1);
    expect(charge).toHaveBeenCalledWith({}, 12);
    expect(charge).toHaveReturned({ status: "failed" });
    expect(response).toHaveProperty("success");
    expect(response.success).toBe(false);
    expect(response).toHaveProperty("error");
    expect(response.error).toMatch(/error/i);
  });
});

vi.mock("../src/libs/email", async (importOriginal) => {
  const originalModule = await importOriginal();

  return {
    ...originalModule,
    sendEmail: vi.fn(),
  };
});

describe("signUp", () => {
  it("should return true if email is valid", async () => {
    vi.mocked(sendEmail).mockResolvedValue(undefined);
    const email = "name@domain.com";

    const r = await signUp(email);

    expect(sendEmail).toBeCalledTimes(1);
    const args = vi.mocked(sendEmail).mock.calls[0];
    expect(args[0]).toBe(email);
    expect(args[1]).toMatch(/welcome/i);
    expect(r).toBe(true);
  });

  it("should return false if email is not valid", async () => {
    vi.mocked(sendEmail).mockResolvedValue(undefined);
    const email = "a";

    const r = await signUp(email);

    expect(sendEmail).toBeCalledTimes(0);
    expect(r).toBe(false);
  });
});

describe("login", () => {
  it("should email the one-time login code", async () => {
    const spy = vi.spyOn(security, "generateCode");
    const email = "name@domain.com";

    await login(email);

    expect(sendEmail).toBeCalledTimes(1);
    const securityCode = spy.mock.results[0].value.toString();
    expect(sendEmail).toHaveBeenCalledWith(email, securityCode);
  });
});

describe("isOnline", () => {
  it("should return false if current hour is outside open hours", async () => {
    vi.setSystemTime("2025-01-01 07:59");
    expect(isOnline()).toBe(false);

    vi.setSystemTime("2025-01-01 20:01");
    expect(isOnline()).toBe(false);
  });

  it("should return true if current hour is within open hours", async () => {
    vi.setSystemTime("2025-01-01 08:00");
    expect(isOnline()).toBe(true);

    vi.setSystemTime("2025-01-01 12:37");
    expect(isOnline()).toBe(true);

    vi.setSystemTime("2025-01-01 19:59");
    expect(isOnline()).toBe(true);
  });
});

describe("getDiscount", () => {
  it("should return 0.2 on Christmas Day", async () => {
    vi.setSystemTime("2025-12-25 00:01");
    expect(getDiscount()).toBe(0.2);

    vi.setSystemTime("2025-12-25 14:14");
    expect(getDiscount()).toBe(0.2);

    vi.setSystemTime("2025-12-25 23:59");
    expect(getDiscount()).toBe(0.2);
  });

  it("should return 0 on any other day", async () => {
    vi.setSystemTime("2025-12-24 23:59");
    expect(getDiscount()).toBe(0);

    vi.setSystemTime("2025-12-26 00:01");
    expect(getDiscount()).toBe(0);

    vi.setSystemTime("2025-06-01 05:34");
    expect(getDiscount()).toBe(0);
  });
});
