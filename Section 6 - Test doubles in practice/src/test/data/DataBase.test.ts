import { DataBase } from "../../app/data/DataBase";
import * as idGenerator from "../../app/data/IdGenerator";

type someTypeWithId = {
  id: string;
  name: string;
  color: string;
};
const someObject1 = {
  id: "",
  name: "someName",
  color: "blue",
};
const someObject2 = {
  id: "",
  name: "someOtherName",
  color: "blue",
};
describe("DataBase test suite", () => {
  let sut: DataBase<someTypeWithId>;

  const fakeId = "123";
  beforeEach(() => {
    sut = new DataBase<someTypeWithId>();
    jest.spyOn(idGenerator, "generateRandomId").mockReturnValue(fakeId);
  });
  it("should return id after insert", async () => {
    const actual = await sut.insert({
      id: "",
    } as any);
    expect(actual).toBe(fakeId);
  });
  it("should get element after insert", async () => {
    const id = await sut.insert(someObject1);
    const actual = await sut.getBy("id", id);
    expect(actual).toEqual(someObject1);
  });
  it("should find all elements with the same property", async () => {
    await sut.insert(someObject1);
    await sut.insert(someObject2);

    const expected = [someObject1, someObject2];

    const actual = await sut.findAllBy("color", "blue");

    expect(actual).toEqual(expected);
  });
  it("should change color on object", async () => {
    const id = await sut.insert(someObject1);
    const expectedColor = "red";

    await sut.update(id, "color", expectedColor);
    const object = await sut.getBy("id", id);
    const actualColor = object.color;

    expect(actualColor).toBe(expectedColor);
  });
  it("should delete object", async () => {
    const id = await sut.insert(someObject1);
    await sut.delete(id);
    const actual = await sut.getBy("id", id);
    expect(actual).toBeUndefined();
  });
  it("should return elements", async () => {
    await sut.insert(someObject1);
    await sut.insert(someObject2);
    const expected = [someObject1, someObject2];

    const actual = await sut.getAllElements();

    expect(actual).toEqual(expected);
  });
});
