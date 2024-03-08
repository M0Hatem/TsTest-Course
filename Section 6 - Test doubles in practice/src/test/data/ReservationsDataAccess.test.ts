import { ReservationsDataAccess } from "../../app/data/ReservationsDataAccess";
import { DataBase } from "../../app/data/DataBase";

const mockInsert = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();
const mockGetBy = jest.fn();
const mockGetAllElements = jest.fn();
jest.mock("../../app/data/DataBase", () => {
  return {
    DataBase: jest.fn().mockImplementation(() => {
      return {
        insert: mockInsert,
        update: mockUpdate,
        delete: mockDelete,
        getBy: mockGetBy,
        getAllElements: mockGetAllElements,
      };
    }),
  };
});

const fakeId = "123";

const someReservation = {
  id: "",
  room: "someRoom",
  user: "someUser",
  startDate: "startDate",
  endDate: "endDate",
};
describe("ReservationsDataAccess test suite", () => {
  let sut: ReservationsDataAccess;

  beforeEach(() => {
    sut = new ReservationsDataAccess();

    expect(DataBase).toHaveBeenCalledTimes(1);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should createReservation and return an id", async () => {
    mockInsert.mockResolvedValueOnce(fakeId);

    const actual = await sut.createReservation(someReservation);

    expect(actual).toBe(fakeId);
    expect(mockInsert).toBeCalledWith(someReservation);
  });
  it("should make the update reservation call", async () => {
    await sut.updateReservation(fakeId, "endDate", "someEndDate");

    expect(mockUpdate).toHaveBeenCalledWith(fakeId, "endDate", "someEndDate");
  });
  it("should make the delete reservation call", async () => {
    await sut.deleteReservation(fakeId);

    expect(mockDelete).toHaveBeenCalledWith(fakeId);
  });
  it("should return a reservation by id", async () => {
    mockGetBy.mockResolvedValueOnce(someReservation);

    const actual = await sut.getReservation(fakeId);

    expect(actual).toBe(someReservation);
    expect(mockGetBy).toHaveBeenCalledWith("id", fakeId);
  });
  it("should return all reservations", async () => {
    const reservationsArray = [someReservation, someReservation];
    mockGetAllElements.mockResolvedValueOnce(reservationsArray);

    const actual = await sut.getAllReservations();

    expect(actual).toBe(reservationsArray);
    expect(mockGetAllElements).toHaveBeenCalledTimes(1);
  });
});
