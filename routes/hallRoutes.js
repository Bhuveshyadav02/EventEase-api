const App=require("express")
const hallcontrollers=require('../controllers/hallControllers')
const Router=App.Router();
const Authenticate=require("../middleware/authenticate")

Router.post("/createhall",Authenticate,hallcontrollers.createHall)
Router.get("/gethalls",hallcontrollers.gethalls);
Router.get("/gethalls/:id",hallcontrollers.getHallbyId);
Router.delete("/halls/:id",Authenticate,hallcontrollers.deleteHall);
Router.put("/halls/:id",Authenticate,hallcontrollers.updateHall);
module.exports=Router