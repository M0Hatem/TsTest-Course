import { Authorizer } from "../../app/auth/Authorizer";

const someCredentials = {
  userName: "someUserName",
  password: "somePassword",
};

const someId = "abc";

const isValidTokenMock = jest.fn();
const generateTokenMock = jest.fn();
const invalidateTokenMock = jest.fn();

jest.mock("../../app/data/SessionTokenDataAccess", () => {
  return {
    SessionTokenDataAccess: jest.fn().mockImplementation(() => {
      return {
        isValidToken: isValidTokenMock,
        generateToken: generateTokenMock,
        invalidateToken: invalidateTokenMock,
      };
    }),
  };
});

const addUserMock = jest.fn();
const getUserByUserNameMock = jest.fn();

jest.mock("../../app/data/UserCredentialsDataAccess", () => ({
  UserCredentialsDataAccess: jest.fn().mockImplementation(() => ({
    addUser: addUserMock,
    getUserByUserName: getUserByUserNameMock,
  })),
}));
describe("Authorizer test suite", () => {
  let sut: Authorizer;

  beforeEach(() => {
    sut = new Authorizer();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should validate token", async () => {
    isValidTokenMock.mockResolvedValueOnce(false);
    const actual = await sut.validateToken(someId);
    expect(actual).toBe(false);
  });
  it("should return userId when new user registered", async () => {
    addUserMock.mockResolvedValueOnce(someId);

    const actual = await sut.registerUser(
      someCredentials.userName,
      someCredentials.password
    );

    expect(actual).toBe(someId);
  });
  it("should return tokenId for valid credentials", async () => {
    getUserByUserNameMock.mockResolvedValueOnce(someCredentials);
    generateTokenMock.mockResolvedValueOnce(someId);
    const actual = await sut.login(
      someCredentials.userName,
      someCredentials.password
    );

    expect(actual).toBe(someId);
  });
  it("should invalidate token on logout call", async () => {
    await sut.logout(someId);

    expect(invalidateTokenMock).toBeCalledWith(someId);
  });
});
