import { SessionTokenDataAccess } from "../../app/data/SessionTokenDataAccess";
import { DataBase } from "../../app/data/DataBase";
import { Account } from "../../app/model/AuthModel";
const someAccount: Account = {
  id: "",
  password: "somePassword",
  userName: "someUserName",
};

const fakeId = "1234";

const mockInsert = jest.fn();
const mockGetBy = jest.fn();
const mockUpdate = jest.fn();

jest.mock("../../app/data/DataBase", () => {
  return {
    DataBase: jest.fn().mockImplementation(() => {
      return {
        insert: mockInsert,
        getBy: mockGetBy,
        update: mockUpdate,
      };
    }),
  };
});
describe("SessionTokenDataAccess test suite", () => {
  let sut: SessionTokenDataAccess;

  beforeEach(() => {
    sut = new SessionTokenDataAccess();
    expect(DataBase).toHaveBeenCalledTimes(1);
    jest.spyOn(global.Date, "now").mockReturnValue(0);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should insert session token and return it", async () => {
    mockInsert.mockResolvedValueOnce(fakeId);
    const actualTokenId = await sut.generateToken(someAccount);

    expect(actualTokenId).toBe(fakeId);
    expect(mockInsert).toBeCalledWith({
      id: "",
      userName: someAccount.userName,
      valid: true,
      expirationDate: new Date(1000 * 60 * 60),
    });
  });
  it("should invalidate token", async () => {
    await sut.invalidateToken(fakeId);

    expect(mockUpdate).toBeCalledWith(fakeId, "valid", false);
  });
  it("should check valid token", async () => {
    mockGetBy.mockResolvedValueOnce({ valid: true });

    const actual = await sut.isValidToken({} as any);

    expect(actual).toBe(true);
  });
  it("should check inExistent token", async () => {
    mockGetBy.mockResolvedValueOnce(undefined);

    const actual = await sut.isValidToken({} as any);

    expect(actual).toBe(false);
  });
});
