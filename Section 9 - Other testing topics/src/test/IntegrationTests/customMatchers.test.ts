// import {Reservation} from "../../app/model/ReservationModel";
//
// expect.extend({
//     toBeValidReservation(reservation:Reservation){
//
//         const validId =(reservation.id.length > 5)?true:false
//         const validUser =(reservation.user.length > 5)?true:false
//
//         return{
//             pass:validId&&validUser,
//             message:()=>'expected reservation to have valid id and user'
//         }
//     },
//     toHaveUser(reservation:Reservation,user:string){
//         const hasUser = user == reservation.user
//         return{
//             pass:hasUser,
//             message:()=>'no user'
//         }
//     }
// })
//
// interface CustomMatcher<R>{
//     toBeValidReservation():R;
// }
//
// declare global {
//     namespace jest{
//         interface  Matchers<R>extends CustomMatcher{}
//     }
// }
//
// const someReservation:Reservation = {
//     id:'',
//     endDate:"someEndDate",
//     startDate:'someStartDate',
//     room:"someRoom",
//     user:"someUser"
//
// }
// describe('custom matchers test',async () => {
//
//     it('should check for valid reservation', () => {
//         expect(someReservation).toBeValidReservation()
//     });
// });