const app=require('express')
const authControllers=require("../controllers/authControllers")
const Route=app.Router()
const Authenticate =require("../middleware/authenticate")

Route.post("/register",authControllers.register)
Route.post("/login",authControllers.login)
Route.post("/passwordLink",authControllers.passwordLink)
Route.get("/forgotpassword/:id/:token",authControllers.forgotpassword)
Route.post("/:id/:token",authControllers.setnewPassword)


//logout
Route.get("/logout/:userID",authControllers.logout)

//sending mail for verification and verifying email
Route.post("/verifyemail",Authenticate,authControllers.emailVerificationLink)
Route.get("/verifyemail/:id/:token",Authenticate,authControllers.verifyEmail)


//other routes
Route.get("/about",Authenticate,authControllers.about)
Route.get("/getdata",Authenticate,authControllers.getdata)
Route.post("/contact",Authenticate,authControllers.contact)
module.exports=Route