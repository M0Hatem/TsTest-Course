import {DataBase} from "../../app/data/DataBase";
import * as IdGenerator from "../../app/data/IdGenerator";

type someTypeWithId={
    id:string,
    name:string,
    color:string,
}
describe('database test suite',()=>{
    let sut:DataBase<someTypeWithId>
    const fakeId = '1234'

    beforeEach(()=>{
        sut = new DataBase<someTypeWithId>();
        jest.spyOn(IdGenerator,'generateRandomId').mockReturnValue(fakeId)
    })

    it('should return id after insert',async ()=>{
        const actual = await sut.insert({id:""}as any)

        expect(actual).toBe(fakeId)
    })
})