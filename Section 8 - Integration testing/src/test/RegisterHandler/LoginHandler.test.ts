import { LoginHandler } from "../../app/handlers/LoginHandler";
import { IncomingMessage, ServerResponse } from "http";
import { Authorizer } from "../../app/auth/Authorizer";
import { HTTP_CODES, HTTP_METHODS } from "../../app/model/ServerModel";

const getRequestBodyMock = jest.fn();
jest.mock("../../app/utils/Utils", () => ({
  getRequestBody: () => getRequestBodyMock(),
}));

describe("LoginHandler test suit", () => {
  let sut: LoginHandler;

  const request = {
    method: undefined,
  };
  const responseMock = {
    statusCode: 0,
    writeHead: jest.fn(),
    write: jest.fn(),
  };
  const authorizerMock = {
    login: jest.fn(),
  };
  const someAccount = {
    id: "",
    password: "somePassword",
    userName: "someUserName",
  };
  const someToken = "1234";

  beforeEach(() => {
    sut = new LoginHandler(
      request as IncomingMessage,
      responseMock as any as ServerResponse,
      authorizerMock as any as Authorizer
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should  register valid token in requests if credentials is true", async () => {
    request.method = HTTP_METHODS.POST;
    getRequestBodyMock.mockResolvedValueOnce(someAccount);
    authorizerMock.login.mockResolvedValueOnce(someToken);

    await sut.handleRequest();

    expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED);
    expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.CREATED, {
      "Content-Type": "application/json",
    });
    expect(responseMock.write).toHaveBeenCalledWith(
      JSON.stringify({ token: someToken })
    );
  });
  it("should  register {wrong username or password} in requests if credentials is false", async () => {
    request.method = HTTP_METHODS.POST;
    getRequestBodyMock.mockResolvedValueOnce(someAccount);
    authorizerMock.login.mockResolvedValueOnce("");

    await sut.handleRequest();

    expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_fOUND);
    expect(responseMock.write).toHaveBeenCalledWith(
      JSON.stringify("wrong username or password")
    );
  });
  it("should do nothing for not supported http methods", async () => {
    request.method = HTTP_METHODS.GET;
    await sut.handleRequest();

    expect(responseMock.writeHead).not.toBeCalled();
    expect(responseMock.write).not.toBeCalled();
    expect(getRequestBodyMock).not.toBeCalled();
  });
});
