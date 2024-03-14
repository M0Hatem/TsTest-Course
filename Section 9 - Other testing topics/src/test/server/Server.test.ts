import { Authorizer } from "../../app/auth/Authorizer";
import { ReservationsDataAccess } from "../../app/data/ReservationsDataAccess";
import { Server } from "../../app/server/Server";
import { RegisterHandler } from "../../app/handlers/RegisterHandler";
import { LoginHandler } from "../../app/handlers/LoginHandler";
import { ReservationsHandler } from "../../app/handlers/ReservationsHandler";
import { HTTP_CODES } from "../../app/model/ServerModel";

jest.mock("../../app/auth/Authorizer");
jest.mock("../../app/data/ReservationsDataAccess");
jest.mock("../../app/handlers/LoginHandler");
jest.mock("../../app/handlers/RegisterHandler");
jest.mock("../../app/handlers/ReservationsHandler");

const requestMock = {
  url: "",
  headers: {
    "user-agent": "jest-test",
  },
};

const responseMock = {
  end: jest.fn(),
  writeHead: jest.fn(),
};

const serverMock = {
  listen: jest.fn(),
  close: jest.fn(),
};

jest.mock("http", () => ({
  createServer: (cb: Function) => {
    cb(requestMock, responseMock);
    return serverMock;
  },
}));

describe("Server test suite", () => {
  let sut: Server;

  beforeEach(() => {
    sut = new Server();
    expect(Authorizer).toBeCalledTimes(1);
    expect(ReservationsDataAccess).toBeCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should start server on port 8080 and end the request", async () => {
    await sut.startServer();

    expect(serverMock.listen).toBeCalledWith(8080);

    expect(responseMock.end).toBeCalled();
  });
  it("should handle register requests", async () => {
    requestMock.url = "localhost:8080/register";
    const handleRequestSpy = jest.spyOn(
      RegisterHandler.prototype,
      "handleRequest"
    );

    await sut.startServer();

    expect(handleRequestSpy).toBeCalledTimes(1);
    expect(RegisterHandler).toBeCalledWith(
      requestMock,
      responseMock,
      expect.any(Authorizer)
    );
  });

  it("should handle login requests", async () => {
    requestMock.url = "localhost:8080/login";
    const handleLoginSpy = jest.spyOn(LoginHandler.prototype, "handleRequest");
    await sut.startServer();

    expect(handleLoginSpy).toBeCalledTimes(1);
    expect(LoginHandler).toBeCalledWith(
      requestMock,
      responseMock,
      expect.any(Authorizer)
    );
  });
  it("should handle reservation requests", async () => {
    requestMock.url = "localhost:8080/reservation";
    const handleReservationSpy = jest.spyOn(
      ReservationsHandler.prototype,
      "handleRequest"
    );
    await sut.startServer();

    expect(handleReservationSpy).toBeCalledTimes(1);
    expect(ReservationsHandler).toBeCalledWith(
      requestMock,
      responseMock,
      expect.any(Authorizer),
      expect.any(ReservationsDataAccess)
    );
  });
  it("should do noting for not supported routes", async () => {
    requestMock.url = "localhost:8080/someRoute";
    const validateTokenSpy = jest.spyOn(Authorizer.prototype, "validateToken");
    await sut.startServer();

    expect(validateTokenSpy).not.toBeCalled();
  });
  it("should handle error serving requests", async () => {
    requestMock.url = "localhost:8080/reservation";
    const handleReservationSpy = jest.spyOn(
      ReservationsHandler.prototype,
      "handleRequest"
    );
    handleReservationSpy.mockRejectedValueOnce(new Error("some error"));
    await sut.startServer();

    expect(responseMock.writeHead).toBeCalledWith(
      HTTP_CODES.INTERNAL_SERVER_ERROR,
      JSON.stringify(`Internal server error: some error`)
    );
  });
  it("should stop the server if started", async () => {
    await sut.startServer();
    await sut.stopServer();

    expect(serverMock.close).toBeCalledTimes(1);
  });
});
