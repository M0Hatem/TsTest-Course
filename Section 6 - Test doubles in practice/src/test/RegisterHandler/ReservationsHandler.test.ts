import { ReservationsHandler } from "../../app/handlers/ReservationsHandler";
import { IncomingMessage, ServerResponse } from "http";
import { Authorizer } from "../../app/auth/Authorizer";
import { ReservationsDataAccess } from "../../app/data/ReservationsDataAccess";
import { HTTP_CODES, HTTP_METHODS } from "../../app/model/ServerModel";
import { Reservation } from "../../app/model/ReservationModel";

const getRequestBodyMock = jest.fn();
jest.mock("../../app/utils/Utils", () => ({
  getRequestBody: () => getRequestBodyMock(),
}));

describe("ReservationsHandler test suit", () => {
  let sut: ReservationsHandler;

  const request = {
    method: undefined,
    headers: {
      authorization: undefined,
    },
    url: undefined,
  };
  const responseMock = {
    statusCode: 0,
    write: jest.fn(),
    writeHead: jest.fn(),
  };
  const authorizerMock = {
    registerUser: jest.fn(),
    validateToken: jest.fn(),
  };
  const reservationsDataAccessMock = {
    createReservation: jest.fn(),
    getAllReservations: jest.fn(),
    getReservation: jest.fn(),
    updateReservation: jest.fn(),
    deleteReservation: jest.fn(),
  };
  const someReservation = {
    id: "",
    room: "someRoom",
    user: "someUser",
    startDate: "startDate",
    endDate: "endDate",
  };
  const someId = "1234";
  beforeEach(() => {
    sut = new ReservationsHandler(
      request as IncomingMessage,
      responseMock as any as ServerResponse,
      authorizerMock as any as Authorizer,
      reservationsDataAccessMock as any as ReservationsDataAccess
    );
    request.headers.authorization = "abc";
    authorizerMock.validateToken.mockResolvedValueOnce(true);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe("POST requests", () => {
    beforeEach(() => {
      request.method = HTTP_METHODS.POST;
    });
    it("should create reservation from valid request", async () => {
      getRequestBodyMock.mockResolvedValueOnce(someReservation);
      reservationsDataAccessMock.createReservation.mockResolvedValueOnce(
        someId
      );

      await sut.handleRequest();

      expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED);
      expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.CREATED, {
        "Content-Type": "application/json",
      });
      expect(responseMock.write).toHaveBeenCalledWith(
        JSON.stringify({ reservationId: someId })
      );
    });
    it("should not create reservation from valid request", async () => {
      getRequestBodyMock.mockResolvedValueOnce({});

      await sut.handleRequest();

      expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseMock.write).toHaveBeenCalledWith(
        JSON.stringify("Incomplete reservation!")
      );
    });
    it("should not create reservation from invalid fields in request", async () => {
      const moreThanAReservation = { ...someReservation, someField: "123" };
      getRequestBodyMock.mockResolvedValueOnce(moreThanAReservation);

      await sut.handleRequest();

      expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseMock.write).toHaveBeenCalledWith(
        JSON.stringify("Incomplete reservation!")
      );
    });
  });
  describe("GET requests", () => {
    beforeEach(() => {
      request.method = HTTP_METHODS.GET;
    });
    it("should return all reservations for /all request", async () => {
      request.url = "/reservations/all";
      const allReservations = [someReservation, someReservation];
      reservationsDataAccessMock.getAllReservations.mockResolvedValueOnce(
        allReservations
      );

      await sut.handleRequest();

      expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.OK, {
        "Content-Type": "application/json",
      });
      expect(responseMock.write).toHaveBeenCalledWith(
        JSON.stringify(allReservations)
      );
    });
    it("should return reservation for existing id", async () => {
      request.url = `/reservations/${someId}`;
      reservationsDataAccessMock.getReservation.mockResolvedValueOnce(
        someReservation
      );

      await sut.handleRequest();

      expect(responseMock.writeHead).toHaveBeenCalledWith(HTTP_CODES.OK, {
        "Content-Type": "application/json",
      });
      expect(responseMock.write).toHaveBeenCalledWith(
        JSON.stringify(someReservation)
      );
    });
    it("should not return reservation for nonExisting id", async () => {
      request.url = `/reservations/${someId}`;
      reservationsDataAccessMock.getReservation.mockResolvedValueOnce(
        undefined
      );

      await sut.handleRequest();

      expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_fOUND);
      expect(responseMock.write).toHaveBeenCalledWith(
        JSON.stringify(`Reservation with id ${someId} not found`)
      );
    });
    it("should return bad request if no id provided", async () => {
      request.url = `/reservations`;

      await sut.handleRequest();

      expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseMock.write).toBeCalledWith(
        JSON.stringify("Please provide an ID!")
      );
    });
  });
  describe("PUT request", () => {
    beforeEach(() => {
      request.method = HTTP_METHODS.PUT;
    });
    it("should return not found for non existing id", async () => {
      request.url = `/reservations/${someId}`;
      reservationsDataAccessMock.getReservation.mockReturnValueOnce(undefined);

      await sut.handleRequest();

      expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_fOUND);
      expect(responseMock.write).toHaveBeenCalledWith(
        JSON.stringify(`Reservation with id ${someId} not found`)
      );
    });
    it("should return bad request if no id provided", async () => {
      request.url = `/reservations`;

      await sut.handleRequest();

      expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseMock.write).toHaveBeenCalledWith(
        JSON.stringify("Please provide an ID!")
      );
    });
    it("should return bad request if invalid fields are provided", async () => {
      request.url = `/reservations/${someId}`;
      reservationsDataAccessMock.getReservation.mockReturnValueOnce(
        someReservation
      );
      getRequestBodyMock.mockResolvedValueOnce({
        ...someReservation,
        someField: "someValue",
      });

      await sut.handleRequest();

      expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseMock.write).toHaveBeenCalledWith(
        JSON.stringify("Please provide valid fields to update!")
      );
    });
    it("should return bad request if no fields are provided", async () => {
      request.url = `/reservations/${someId}`;
      reservationsDataAccessMock.getReservation.mockReturnValueOnce(
        someReservation
      );
      getRequestBodyMock.mockResolvedValueOnce({});

      await sut.handleRequest();

      expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseMock.write).toHaveBeenCalledWith(
        JSON.stringify("Please provide valid fields to update!")
      );
    });
    it("should update reservation with all valid fields provided", async () => {
      request.url = `/reservations/${someId}`;
      const updatedReservation = {
        room: "someAnotherRoom",
        user: "someAnotherUser",
      };
      reservationsDataAccessMock.getReservation.mockReturnValueOnce(
        someReservation
      );
      getRequestBodyMock.mockResolvedValueOnce(updatedReservation);

      await sut.handleRequest();

      expect(
        reservationsDataAccessMock.updateReservation
      ).toHaveBeenCalledTimes(2);
      expect(reservationsDataAccessMock.updateReservation).toHaveBeenCalledWith(
        someId,
        "room",
        updatedReservation.room
      );
      expect(reservationsDataAccessMock.updateReservation).toHaveBeenCalledWith(
        someId,
        "user",
        updatedReservation.user
      );

      expect(responseMock.write).toHaveBeenCalledWith(
        JSON.stringify(
          `Updated ${Object.keys(updatedReservation)} of reservation ${someId}`
        )
      );
    });
  });
  describe("DELETE requests", () => {
    beforeEach(() => {
      request.method = HTTP_METHODS.DELETE;
    });
    it("should delete reservation with provided id", async () => {
      request.url = `/reservations/${someId}`;

      await sut.handleRequest();

      expect(reservationsDataAccessMock.deleteReservation).toBeCalledWith(
        someId
      );
      expect(
        reservationsDataAccessMock.deleteReservation
      ).toHaveBeenCalledTimes(1);
      expect(responseMock.statusCode).toBe(HTTP_CODES.OK);
      expect(responseMock.write).toHaveBeenCalledWith(
        JSON.stringify(`Deleted reservation with id ${someId}`)
      );
    });
    it("should return bad request if no id provided", async () => {
      request.url = `/reservations`;

      await sut.handleRequest();

      expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
      expect(responseMock.write).toBeCalledWith(
        JSON.stringify("Please provide an ID!")
      );
    });
  });
  it("should return nothing for not authorized requests", async () => {
    request.headers.authorization = "1234";
    authorizerMock.validateToken.mockReset();
    authorizerMock.validateToken.mockReturnValueOnce(false);
    await sut.handleRequest();

    expect(responseMock.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
    expect(responseMock.write).toBeCalledWith(
      JSON.stringify("Unauthorized operation!")
    );
  });
  it("should return nothing if no authorization header is present", async () => {
    request.headers.authorization = undefined;

    await sut.handleRequest();

    expect(responseMock.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
    expect(responseMock.write).toBeCalledWith(
      JSON.stringify("Unauthorized operation!")
    );
  });

  it("should do nothing for not supported http methods", async () => {
    request.method = "SOME-METHOD";

    await sut.handleRequest();

    expect(responseMock.write).not.toBeCalled();
    expect(responseMock.writeHead).not.toBeCalled();
  });
});
