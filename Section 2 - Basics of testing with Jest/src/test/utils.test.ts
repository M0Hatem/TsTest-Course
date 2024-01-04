import { beforeAll, beforeEach, describe, expect, it } from "vitest";

import { getStringInfo, toUpperCase } from "../app/utils";

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
