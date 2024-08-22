const Hall=require('../modals/hallSchema')

const createHall=async(req,res,next)=>{
    //console.log(req.rootUser,email)
    try {
        const {name,location,amenities,capacity,hallcreater,description }=req.body
        if(!name||!location||!amenities||!capacity||!description){
            return res.status(422).json({error:"Kindly fill all the Fields"})
        }
        if(capacity<=0){
            return res.status(422).json({error:"capacity cannot be zero or negative"})
        }
        const hall=new Hall({name,location,amenities,capacity,hallcreater:req.rootUser.email,description})
         await hall.save();
         res.status(200).json({message:"Hall created Successfully",hall:hall})   
    } catch (error) {
         res.status(422).json({error:error})
    }


}
const gethalls=async(req,res,next)=>{
    try {
        const halls=await Hall.find()
        res.status(200).json({halls})
        console.log(req)
    } catch (error) {
        res.send(error)
    }
   
}
const getHallbyId=async(req,res,next)=>{
    const {id}=req.params
    try {
        const hall=await Hall.findById(id)
        if(!hall){
          return   res.status(422).json({error:"Hall does not exist"})
        }
        res.status(200).json({hall})
    } catch (error) {
        res.status(422).json({error})
    }
}
const deleteHall=async(req,res,next)=>{

    try {
        const {id}=req.params;
        const hall =await Hall.findByIdAndDelete({_id:id})
        console.log(hall)
        if(!hall){
            return res.status(400).json({error:"Hall Not exist"})
        }
        res.status(200).json({message:"Hall deleted Successfully"})
    } catch (error) {
        res.status(422).json({error})
    }
}
const updateHall =async (req,res,next)=>{
    console.log(req.params)
    const{id}=req.params
    const {name,location,amenities,capacity,hallcreater,description}=req.body
const userType=req.rootUser.userType
if(userType!=="admin"){
    return res.status(403).json({message:"Unthorized"})
}
const hall=await Hall.findByIdAndUpdate(id,{
    name,location,amenities,capacity,hallcreater,description,new:true
})
await hall.save()
res.status(200).json({message:"Hall Update successfully",hall:hall})
}
module.exports={createHall,gethalls,getHallbyId,deleteHall,updateHall}