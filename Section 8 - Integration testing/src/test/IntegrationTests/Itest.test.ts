import {Server} from "../../app/server/Server";
import {HTTP_CODES, HTTP_METHODS} from "../../app/model/ServerModel";
import {Account} from "../../app/model/AuthModel";
import {makeAwesomeRequest} from "./Utils/http-client";
import {Reservation} from "../../app/model/ReservationModel";

describe('Server app integration tests', () => {
    let server:Server;

    beforeAll(()=>{
        server = new Server()
        server.startServer()
    })
    afterAll(()=>{
        server.stopServer()
    })

    const someUser:Account={
        id:'',
        userName:'someUserName',
        password:'somePassword',
    }
    const someReservation:Reservation = {
        id:'',
        startDate:'someEndDate',
        endDate:'someEndDate',
        room:'someRoom',
        user:'someUser'
    }

    it('should register new user',async () => {
        const result = await fetch('http://localhost:8080/register',{
            method:HTTP_METHODS.POST,
            body: JSON.stringify(someUser)
        })
        const resultBody = await result.json()
        expect(result.status).toBe(HTTP_CODES.CREATED)
        expect(result.body).toBeDefined()
    });
    it('should register new user',async () => {
        const result = await makeAwesomeRequest({
            host:'localhost',
            port:8080,
            method:HTTP_METHODS.POST,
            path:'/register'
        },someUser)

        expect(result.statusCode).toBe(HTTP_CODES.CREATED)
        expect(result.body.userId).toBeDefined()
    });

    let token:string;
    it('should login a registered user',async () => {
        const result = await fetch('http://localhost:8080/login',{
            method:HTTP_METHODS.POST,
            body: JSON.stringify(someUser)
        })
        const resultBody = await result.json()
        expect(result.status).toBe(HTTP_CODES.CREATED)
        expect(resultBody.token).toBeDefined()
        token = resultBody.token
    });
    let createdReservation:string;
    it('should create reservation if authorized',async () => {
        const result = await fetch('http://localhost:8080/reservation',{
            method:HTTP_METHODS.POST,
            body: JSON.stringify(someReservation),
            headers:{
                authorization:token
            }
        })

        const resultBody = await result.json()
        expect(result.status).toBe(HTTP_CODES.CREATED)
        expect(resultBody.reservationId).toBeDefined()
        createdReservation = resultBody.reservationId
    });
    it('should get reservation if authorized',async () => {
        const result = await fetch(`http://localhost:8080/reservation/${createdReservation}`,{
            method:HTTP_METHODS.GET,
            headers:{
                authorization:token
            }
        })

        const resultBody = await result.json()

        const expectedReservation = structuredClone(someReservation)
        expectedReservation.id=createdReservation

        expect(result.status).toBe(HTTP_CODES.OK)
        expect(resultBody).toEqual(expectedReservation)
    });
    it('should create and retrieve multiple reservation if authorized',async () => {
        await fetch(`http://localhost:8080/reservation/${createdReservation}`,{
            method:HTTP_METHODS.POST,
            body: JSON.stringify(someReservation),
            headers:{
                authorization:token
            }
        })
        await fetch(`http://localhost:8080/reservation/${createdReservation}`,{
            method:HTTP_METHODS.POST,
            body: JSON.stringify(someReservation),
            headers:{
                authorization:token
            }
        })
        await fetch(`http://localhost:8080/reservation/${createdReservation}`,{
            method:HTTP_METHODS.POST,
            body: JSON.stringify(someReservation),
            headers:{
                authorization:token
            }
        })


        const getAllReservation = await fetch(`http://localhost:8080/reservation/all`,{
            method:HTTP_METHODS.GET,
            headers:{
                authorization:token
            }
        })

        const resultBody = await getAllReservation.json();

        expect(getAllReservation.status).toBe(HTTP_CODES.OK)
        expect(resultBody).toHaveLength(4)
    });
    it('should update reservation if authorized',async () => {
        const updateResult = await fetch(`http://localhost:8080/reservation/${createdReservation}`,{
            method:HTTP_METHODS.PUT,
            body: JSON.stringify({
                startDate:'otherStartDate'
            }),
            headers:{
                authorization:token
            }
        })


        expect(updateResult.status).toBe(HTTP_CODES.OK)

        const result = await fetch(`http://localhost:8080/reservation/${createdReservation}`,{
            method:HTTP_METHODS.GET,
            headers:{
                authorization:token
            }
        })
        const resultBody:Reservation = await result.json();

        expect(resultBody.startDate).toBe('otherStartDate')
    });
    it('should delete reservation if authorized',async () => {
        const deleteResult = await fetch(`http://localhost:8080/reservation/${createdReservation}`,{
            method:HTTP_METHODS.DELETE,

            headers:{
                authorization:token
            }
        })


        expect(deleteResult.status).toBe(HTTP_CODES.OK)

        const result = await fetch(`http://localhost:8080/reservation/${createdReservation}`,{
            method:HTTP_METHODS.GET,
            headers:{
                authorization:token
            }
        })


        expect(result.status).toBe(HTTP_CODES.NOT_fOUND)
    });

});