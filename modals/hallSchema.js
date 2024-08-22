const moongooese=require('mongoose')

const hallSchema= new moongooese.Schema({
name:{
type:String,
required:true,
unique:true
},
location:{
    type:String,
    required:true
},
amenities:{
type:String,
required:true,
},
capacity:{
type:Number,
required:true
},
hallcreater:{
type:String,
required:true,
},
description:{
    type:String,
    required:true
}




})
module.exports=moongooese.model("Hall",hallSchema);