const moongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require('dotenv').config()

const UserSchema = new moongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  institution: {
    type: String,
    require: true,
  },
  department: {
    type: String,
    require: true,
  },
  phone: {
    type: Number,
    require: true,
  },
  userType: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  cpassword: {
    type: String,
    require: true,
  },
  adminkey: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    default:  Date.now,
  },
  tokens:[
    {
        token:{
            type:String,
            require:true
        },
    },
  ],
  verifytoken:{
    type:String
  },
  emailVerified:{
    type:Boolean,
    default:false

  }
});

UserSchema.pre('save',async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,12)
        this.cpassword=await bcrypt.hash(this.cpassword,12)
    }
    next()
});
UserSchema.methods.generateAuthToken = async function () {
    try {
      let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY, { expiresIn: '2d' });
      this.tokens = this.tokens.concat({ token: token });
      await this.save();
      return token;
    } catch (error) {
       console.log(error);
    }
  };

  const User=moongoose.model("USER",UserSchema)
  module.exports=User
