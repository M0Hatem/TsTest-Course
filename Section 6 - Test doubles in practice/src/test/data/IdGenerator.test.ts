import { generateRandomId } from "../../app/data/IdGenerator";

describe("Id Generator test suite", () => {
  it("should return a random string", () => {
    const randomId = generateRandomId();

    expect(randomId.length).toBe(20);
  });
});
