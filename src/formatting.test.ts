import { formatDate, formatDuration, formatError } from "./formatting";
import { IsoDate } from "./IsoDate";

describe("Formatting durations", () => {
  it("should work with zero hours and zero minutes", () => {
    const durationString = formatDuration(0);
    expect(durationString).toBe("0 minutes");
  });

  it("should work with exactly 1 minute", () => {
    const durationString = formatDuration(1);
    expect(durationString).toBe("1 minute");
  });

  it("should work with minutes alone", () => {
    const durationString = formatDuration(4);
    expect(durationString).toBe("4 minutes");
  });

  it("should work with exactly 1 hour", () => {
    const durationString = formatDuration(60);
    expect(durationString).toBe("1 hour");
  });

  it("should work with 1 hour and 1 minute", () => {
    const durationString = formatDuration(60 + 1);
    expect(durationString).toBe("1 hour, 1 minute");
  });

  it("should work with 1 hour and several minutes", () => {
    const durationString = formatDuration(60 + 5);
    expect(durationString).toBe("1 hour, 5 minutes");
  });

  it("should work with several hours alone", () => {
    const durationString = formatDuration(2 * 60);
    expect(durationString).toBe("2 hours");
  });

  it("should work with several hours and one minute", () => {
    const durationString = formatDuration(5 * 60 + 1);
    expect(durationString).toBe("5 hours, 1 minute");
  });

  it("should work with both hours and minutes", () => {
    const durationString = formatDuration(3 * 60 + 57);
    expect(durationString).toBe("3 hours, 57 minutes");
  });

  it("should throw with negative minutes", () => {
    expect(() => {
      formatDuration(-8);
    }).toThrow("Invalid total minutes: -8");
  });
});

describe("Formatting dates", () => {
  it("should convert to a more natural format", () => {
    expect(formatDate(new IsoDate("2020-07-09"))).toBe("July 9, 2020");
  });
});

describe("Formatting an error", () => {
  it("should return just the message when given an Error", () => {
    const testError = new Error("My test");

    expect(formatError(testError)).toBe("My test");
  });

  it("should return just the message when given an Error subclass", () => {
    class MyError extends Error {}

    const testError = new MyError("Another test");

    expect(formatError(testError)).toBe("Another test");
  });

  it("should return the value itself when given a string", () => {
    const errorValue = "String error";

    expect(formatError(errorValue)).toBe("String error");
  });

  it("should return the value itself as a string when given a number", () => {
    const errorValue = 90;

    expect(formatError(errorValue)).toBe("90");
  });
});
