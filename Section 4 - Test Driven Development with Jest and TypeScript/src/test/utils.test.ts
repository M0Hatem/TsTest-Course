import { beforeAll, beforeEach, describe, expect, it } from "vitest";

import { getStringInfo, StringUtils, toUpperCase } from "../app/utils";

describe("Util Test suite", () => {
  it("should return upperCase of valid string", () => {
    //arrange
    const sut = toUpperCase;
    const expected = "ABC";
    //act
    const actual = sut("abc");
    //assert
    expect(actual).toBe(expected);
  });
  describe("toUpperCase Examples", () => {
    it.each([
      { input: "abc", expected: "ABC" },
      { input: "My-String", expected: "MY-STRING" },
      { input: "def", expected: "DEF" },
    ])("$input toUpperCase should be $expected", ({ input, expected }) => {
      const actual = toUpperCase(input);

      expect(actual).toBe(expected);
    });
  });
  describe("String Util tests", () => {
    let sut: StringUtils;
    beforeEach(() => {
      sut = new StringUtils();
    });
    it("should throw an error if no argument passed - function", () => {
      function expectError() {
        const actual = sut.toUpperCase("");
      }
      expect(expectError).toThrow();
      expect(expectError).toThrowError("Invalid argument!");
    });
    it("should throw an error if no argument passed - arrow function", () => {
      expect(() => {
        sut.toUpperCase("");
      }).toThrow();
    });
    it("should throw an error if no argument passed - try catch block", () => {
      try {
        sut.toUpperCase("");
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(err).toHaveProperty("message", "Invalid argument!");
      }
    });
  });
  describe("getStringInfo for arg My-String", () => {
    let actual;
    beforeAll(() => {
      const actual = getStringInfo("My-String");
    });
    it("return right length", () => {
      expect(actual.length).toHaveLength(9);
    });
    it("return right upperCase", () => {
      const actual = getStringInfo("My-String");
      expect(actual.upperCase).toBe("MY-STRING");
    });
    it("return right lowerCase", () => {
      const actual = getStringInfo("My-String");
      expect(actual.lowerCase).toBe("my-string");
    });
  });
});
