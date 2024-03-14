import {RequestTestWrapper} from "./test_utils/RequestTestWrapper";
import {ResponseTestWrapper} from "./test_utils/ResponseTestWrapper";
import {HTTP_CODES, HTTP_METHODS} from "../../app/model/ServerModel";
import {UserCredentialsDataAccess} from "../../app/data/UserCredentialsDataAccess";
import {Server} from "../../app/server/Server";
import {DataBase} from "../../app/data/DataBase";



jest.mock("../../app/data/DataBase")

const requestWrapper = new RequestTestWrapper()
const responseWrapper  = new ResponseTestWrapper()

const server={
    listen:()=>{},
    close:()=>{}
}
jest.mock('http',()=>({
    createServer:(cb:Function)=>{
        cb(requestWrapper,responseWrapper)
        return server
    }
}))

const someCredentials ={
   id:'',
    userName:'someUserName',
    password:'somePassword'
}

const someToken = '1234'

const jsonHeader = { 'Content-Type': 'application/json' }
describe('LoginRequests test suite', () => {
    const insertSpy = jest.spyOn(DataBase.prototype, 'insert');
    const getBySpy = jest.spyOn(DataBase.prototype, 'getBy');

    beforeEach(()=>{
        requestWrapper.headers['user-agent'] = 'jest tests'
    })
    afterEach(()=>{
        requestWrapper.clearFields()
        responseWrapper.clearFields()
        jest.clearAllMocks();
    })
    it('should login the user and return token if ture credential passed',async () => {
        requestWrapper.method = HTTP_METHODS.POST;
        requestWrapper.body = someCredentials
        requestWrapper.url = 'localHost:8080/login'

        getBySpy.mockResolvedValueOnce(someCredentials);
        insertSpy.mockResolvedValueOnce(someToken);

        await new Server().startServer()

        await new Promise(process.nextTick)

        expect(responseWrapper.statusCode).toBe(HTTP_CODES.CREATED);
        expect(responseWrapper.body).toEqual({
            token: someToken
        })
        expect(responseWrapper.headers).toContainEqual(jsonHeader);
    });
    it('should not login the user if false credential passed',async () => {
        requestWrapper.method = HTTP_METHODS.POST;
        requestWrapper.body = {
            userName:'someUserName',
            password:'wrong Password'
        }
        requestWrapper.url = 'localHost:8080/login'

        getBySpy.mockResolvedValueOnce({});

        await new Server().startServer()

        await new Promise(process.nextTick)

        expect(responseWrapper.statusCode).toBe(HTTP_CODES.NOT_fOUND)
        expect(responseWrapper.body).toEqual('wrong username or password')
    });
    it("should return bad request if no credentials in request",async () => {
        requestWrapper.method = HTTP_METHODS.POST;
        requestWrapper.body = {

        }
        requestWrapper.url = 'localHost:8080/login'



        await new Server().startServer()

        await new Promise(process.nextTick)

        expect(responseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST)
        expect(responseWrapper.headers).toContainEqual(jsonHeader);
        expect(responseWrapper.body).toEqual('userName and password required')
    });
    it("should do nothing for not supported methods",async () => {
        requestWrapper.method = HTTP_METHODS.DELETE;

        requestWrapper.url = 'localHost:8080/login'



        await new Server().startServer()

        await new Promise(process.nextTick)

        expect(responseWrapper.statusCode).toBeUndefined();
        expect(responseWrapper.headers).toHaveLength(0);
        expect(responseWrapper.body).toBeUndefined();
    });

});