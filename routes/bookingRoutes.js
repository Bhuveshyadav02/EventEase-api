const express=require("express")
const bookingControllers=require('../controllers/bookingControllers')
const Authenticate=require('../middleware/authenticate')
const Router=express.Router();

Router.get("/bookings",Authenticate,bookingControllers.getBooking);
Router.get("/bookinghod",Authenticate,bookingControllers.getBookingHod);
Router.get("/bookingadmin",Authenticate,bookingControllers.getBookingAdmin);
Router.get("/bookingView/:id",Authenticate,bookingControllers.getBookingbyId);
Router.get("/bookingfaculty",Authenticate,bookingControllers.getBookingByUserId)
Router.get("/events",bookingControllers.getEvents)


Router.post("/bookings",Authenticate,bookingControllers.createBooking);
Router.put("/bookingsEdit/:id",Authenticate,bookingControllers.updateBooking)
Router.delete("/bookings/:id",Authenticate,bookingControllers.deleteBooking)
module.exports=Router