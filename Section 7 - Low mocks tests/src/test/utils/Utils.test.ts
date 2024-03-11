import { getRequestBody } from "../../app/utils/Utils";
import { IncomingMessage } from "http";

describe("getRequestBody test suite", () => {
  const requestMock = {
    on: jest.fn(),
  };
  const someObject = {
    name: "m16",
    age: 19,
  };

  const someObjectAsString = JSON.stringify(someObject);

  it("should return object for valid JSON", async () => {
    requestMock.on.mockImplementation((event, cb) => {
      if (event === "data") {
        cb(someObjectAsString);
      } else {
        cb();
      }
    });
    const actual = await getRequestBody(requestMock as any as IncomingMessage);

    expect(actual).toEqual(someObject);
  });

  it("should throw error for invalid JSON", async () => {
    requestMock.on.mockImplementation((event, cb) => {
      if (event === "data") {
        cb("a" + someObjectAsString);
      } else {
        cb();
      }
    });
    await expect(getRequestBody(requestMock as any)).rejects.toThrow(
      "Unexpected token a in JSON at position 0"
    );
  });
  it("should throw error for unexpected error", async () => {
    const someError = new Error("something went wrong!");
    requestMock.on.mockImplementation((event, cb) => {
      if (event == "error") {
        cb(someError);
      }
    });
    await expect(getRequestBody(requestMock as any)).rejects.toThrow(
      someError.message
    );
  });
});
