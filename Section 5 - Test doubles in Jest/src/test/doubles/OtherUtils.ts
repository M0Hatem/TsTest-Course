import {
  calculateComplexity,
  OtherStringUtils,
  toUppercaseWithCb,
} from "../../app/doubles/OtherUtils";

describe("OtherUtils test suite", () => {
  describe("OtherStringUtils tests with spies", () => {
    let sut: OtherStringUtils;
    beforeEach(() => {
      sut = new OtherStringUtils();
    });
    test("use a spy to track calls", () => {
      const toUpperCaseSpy = jest.spyOn(sut, "toUpperCase");
      sut.toUpperCase("abc");

      expect(toUpperCaseSpy).toBeCalledWith("abc");
    });
    test("use a spy to track calls to other module", () => {
      const consoleLogSpy = jest.spyOn(console, "log");
      sut.logString("abc");

      expect(consoleLogSpy).toBeCalledWith("abc");
    });
    test("use a spy to replace the implementation of a method", () => {
      jest.spyOn(sut, "callExternalService").mockImplementationOnce(() => {
        console.log("calling mocked implementation !");
      });
      sut.callExternalService();
    });
  });

  describe("Tracking callbacks with Jest mocks", () => {
    const callBackMock = jest.fn();
    afterEach(() => {
      jest.clearAllMocks();
    });
    it("toUpperCase - call callback for invalid argument", () => {
      const actual = toUppercaseWithCb("", callBackMock);

      expect(actual).toBeUndefined();
      expect(callBackMock).toBeCalledWith("Invalid argument!");
      expect(callBackMock).toBeCalledTimes(1);
    });
    it("toUpperCase - call callback for valid argument", () => {
      const actual = toUppercaseWithCb("abc", callBackMock);

      expect(actual).toBe("ABC");
      expect(callBackMock).toBeCalledWith(`called function with abc`);
      expect(callBackMock).toBeCalledTimes(1);
    });
  });

  describe("Tracking callbacks", () => {
    beforeEach(() => {
      cbArg = [];
      timesCalled = 0;
    });
    let cbArg = [];
    let timesCalled = 0;
    function callBackMock(arg: string) {
      cbArg.push(arg);
      timesCalled++;
    }
    it("toUpperCase - call callback for invalid argument", () => {
      const actual = toUppercaseWithCb("", callBackMock);

      expect(actual).toBeUndefined();
      expect(cbArg).toContain("Invalid argument!");
      expect(timesCalled).toBe(1);
    });
    it("toUpperCase - call callback for valid argument", () => {
      const actual = toUppercaseWithCb("abc", callBackMock);

      expect(actual).toBe("ABC");
      expect(cbArg).toContain(`called function with abc`);
      expect(timesCalled).toBe(1);
    });
  });
  it("toUpperCase - call callback for invalid argument", () => {
    const actual = toUppercaseWithCb("", () => {});

    expect(actual).toBeUndefined();
  });
  it("toUpperCase - call callback for valid argument", () => {
    const actual = toUppercaseWithCb("abc", () => {});

    expect(actual).toBe("ABC");
  });

  it("Calculates complexity", () => {
    const someInfo = {
      length: 5,
      extraInfo: {
        field1: "someInfo",
        field2: "someOtherInfo",
      },
    };
    const actual = calculateComplexity(someInfo as any);
    expect(actual).toBe(10);
  });
});
