const User = require("../modals/userSchema");
require("dotenv").config();
const bycrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      institution,
      department,
      phone,
      userType,
      password,
      cpassword,
      adminkey,
    } = req.body;
    //admin
    if (userType === "admin") {
      if (
        !name ||
        !email ||
        
        !phone ||
        !password ||
        !cpassword
      ) {
        return res.status(422).json({ error: "Kindly Fill all The Fields" });
      } else if (adminkey !== process.env.SECRET_KEY) {
        return res.status(422).json({ error: "Provided adminkey is invalid" });
      }
    }
    //hod
    const hodexist = await User.findOne({ department, userType: "HOD" });
    if (userType === "hod") {
      if (
        !name ||
        !email | !institution ||
        !department ||
        !phone ||
        !password ||
        !cpassword
      ) {
        return res.status(422).json({ error: "Kindly Fill all The Fields" });
      }
      if (hodexist) {
        return res
          .status(422)
          .json({ error: `HOD already exist for ${department}` });
      }
    } else if(userType==="hod") {
      if (
        !name ||
        !email | !institution ||
        !department ||
        !phone ||
        !password ||
        !cpassword
      ) {
        return res.status(422).json({ error: "Kindly Fill all The Fields" });
      }
    }
    // //res.status(200).send('Register routes Working Properly')
    const nameRegex =
      /^[\w'.]+\s[\w'.]+\s*[\w'.]*\s*[\w'.]*\s*[\w'.]*\s*[\w'.]*$/;
    if (!nameRegex.test(name)) {
      return res.status(422).json({ error: "Kindle Provide your Full name" });
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(422).json({ error: "Kindle Provide Valid emailId" });
    }
    //const academicEmailRegex = /^[a-zA-Z0-9._%+-]+@medicaps\.ac\.in$/;
   // const academicEmailRegex=/^a-z0-9{5,}@g(oogle)?mail\.com$/

   // if (!academicEmailRegex.test(email)) {
     // return res.status(422).json({
       // error: "Provided Email not associated with MediCaps University",
      //});
    //}
    if (phone.length !== 10) {
      let phoneLength = phone.length;
      return res.status(422).json({
        error: "Kindly Provide 10 digits Phone Number",
        phoneLength: phoneLength,
      });
    }
    if (password.length < 7) {
      return res
        .status(422)
        .json({ error: "Password should contain atleast seven charcters" });
    }
    if (password !== cpassword) {
      return res
        .status(422)
        .json({ error: "Password do not match with Confirm Password" });
    }
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(422)
        .json({ error: "Provided Email id asscoiated with other account" });
    } else {
      let user;
      if (userType === "admin") {
        user = new User({
          name,
          email,
          institution: "NULL",
          department: "NULL",
          phone,
          userType,
          password,
          cpassword,
          adminkey,
        });
      } else {
        user = new User({
          name,
          email,
          institution,
          department,
          phone,
          userType,
          password,
          cpassword,
          adminkey: "NULL",
          
        });
      }
      await user.save();
      res.status(200).json({ user });
    }
  } catch (error) {
    next(error);
  }
};
const login = async (req, res, next) => {
  // const {email,password}=req.body
  try {
    let token;
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({ error: "Kindly complete all the feilds" });
    }
    const isUserExist = await User.findOne({ email });
    if (!isUserExist) {
      return res.status(422).json({ error: "User not Exist" });
    }
    if (isUserExist) {
      const isMatch = bycrypt.compare(password, isUserExist.password);
      if (!isMatch) {
        return res.status(422).json({ error: "Invalid Credintials" });
      } else {
        token = await isUserExist.generateAuthToken();
        return res.status(200).json({
          user: isUserExist,
          token: token,
          message: "Login Successfully",
        });
      }
    }
  } catch (error) {}
};
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD,
  },
});

//sending reset pawwordlinks and changing the password
const resetPasswordTemplate = (resetLink, userName) => {
  return `
  
<head>
<meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
<link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
<style>
a,
a:link,
a:visited {
  text-decoration: none;
  color: #00788a;
}

a:hover {
  text-decoration: underline;
}

h2,
h2 a,
h2 a:visited,
h3,
h3 a,
h3 a:visited,
h4,
h5,
h6,
.t_cht {
  color: #000 !important;
}

.ExternalClass p,
.ExternalClass span,
.ExternalClass font,
.ExternalClass td {
  line-height: 100%;
}

.ExternalClass {
  width: 100%;
}
</style>
</head>

<body style="font-size: 1.25rem;font-family: 'Roboto', sans-serif;padding-left:20px;padding-right:20px;padding-top:20px;padding-bottom:20px; background-color: #FAFAFA; width: 75%; max-width: 1280px; min-width: 600px; margin-right: auto; margin-left: auto">
<table cellpadding="12" cellspacing="0" width="100%" bgcolor="#FAFAFA" style="border-collapse: collapse;margin: auto">

<tbody>
  <tr>
    <td style="padding: 50px; background-color: #fff; max-width: 660px">
      <table width="100%" style="">
        <tr>
          <td style="text-align:center">
            <h1 style="font-size: 30px; color: #202225; margin-top: 0;">Hello ${userName}</h1>
            <p style="font-size: 18px; margin-bottom: 30px; color: #202225; max-width: 60ch; margin-left: auto; margin-right: auto">A request has been received to change the password for your account</p>
            <a href="${resetLink}"  style="background-color: #4f46e5; color: #fff; padding: 8px 24px; border-radius: 8px; border-style: solid; border-color: #4f46e5; font-size: 14px; text-decoration: none; cursor: pointer">Reset Password </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</tbody>
<tfoot>
  <tr>
    <td style="text-align: center; padding-top: 30px">
      <table>
        <tr>
            <td>
          <td style="text-align: left;color:#B6B6B6; font-size: 18px; padding-left: 12px">If you didn’t request this, you can ignore this email or let us know. Your password won’t change until you create a new password.</td>
    </td>
  </tr>
</table>

</td>
</tr>
</tfoot>
</table>
</body>



  `;
};

const passwordLink = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(402).json({ message: "Provide Valid Email" });
    }
    const userExist = await User.findOne({ email });
    if (userExist) {
      const token = jwt.sign({ _id: userExist._id }, process.env.SECRET_KEY, {
        expiresIn: "300s",
      });
      const setUsertoken = await User.findByIdAndUpdate(
        { _id: userExist._id },
        { verifyToken: token },
        { new: true }
      );
      if (setUsertoken) {
        const mailOptions = {
          from: process.env.SENDER_EMAIL,
          to: email,
          subject: "Reset BookIt Password",
          html: resetPasswordTemplate(
            `${process.env.CLIENT_URL}/forgotPassword/${userExist.id}/${setUsertoken.verifyToken}`,
            userExist.name
          ),
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent", info.response);
            res.status(201).json({
              status: true,
              message: "Email Sent Successfully",
              _id: userExist.id,
              userToken: token,
            });
          }
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const forgotpassword = async (req, res, next) => {
  try {
    const { id, token } = req.params;
    const validUser = await User.findOne({ _id: id });
    const isValidtoken = jwt.verify(token, process.env.SECRET_KEY);
    if (validUser && isValidtoken) {
     return res.status(201).json({ status: 201, validUser });
    } else {
     return  res.status(401).json({ status: 401, message: "User does not exist" });
    }
  } catch (error) {
   return  res.status(401).json({ status: 401, error });
  }
};
const setnewPassword=async(req,res,next)=>{
  try {
     const {id,token}=req.params
     const {password,cpassword}=req.body
     if(password.length<8||cpassword.length<8){
      return res.status(402).json({error:"Password length must be 7 characters"})

     }
    if(password!==cpassword){
      return res.status(402).json({error:"Password and Confirm Password must be Same"})
    }
    const verifyUser=await User.findOne({_id:id,verifytoken:token})
    const validtoken=jwt.verify(token,process.env.SECRET_KEY)
    if(verifyUser&&validtoken){
      const newPassword=bycrypt.hash(password,12);
      const setNewPassword=await User.findByIdAndUpdate({_id:id},{password:newPassword})
      setNewPassword.save()
      res.status(200).json({status:200,setNewPassword})
    }else{
      res.status(401).json({status:401,message:"user not exist"})
    }

  } catch (error) {
    console.log(error)
  }
}
//const setNewPassword=(req,res,next)

const verifyEmailTemplate = (resetLink,userFind) => {
  return `
  

  <head>
  <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
  <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
  <style>
    a,
    a:link,
    a:visited {
      text-decoration: none;
      color: #00788a;
    }
  
    a:hover {
      text-decoration: underline;
    }
  
    h2,
    h2 a,
    h2 a:visited,
    h3,
    h3 a,
    h3 a:visited,
    h4,
    h5,
    h6,
    .t_cht {
      color: #000 !important;
    }
  
    .ExternalClass p,
    .ExternalClass span,
    .ExternalClass font,
    .ExternalClass td {
      line-height: 100%;
    }
  
    .ExternalClass {
      width: 100%;
    }
  </style>
  </head>
  
  <body style="font-size: 1.25rem;font-family: 'Roboto', sans-serif;padding-left:20px;padding-right:20px;padding-top:20px;padding-bottom:20px; background-color: #FAFAFA; width: 75%; max-width: 1280px; min-width: 600px; margin-right: auto; margin-left: auto">
  <table cellpadding="12" cellspacing="0" width="100%" bgcolor="#FAFAFA" style="border-collapse: collapse;margin: auto">

    <tbody>
    <tr>
      <td style="padding: 50px; background-color: #fff; max-width: 660px">
        <table width="100%" style="">
          <tr>
            <td style="text-align:center">
              <h1 style="font-size: 30px; color: #202225; margin-top: 0;">Hello Admin</h1>
              <p style="font-size: 18px; margin-bottom: 30px; color: #202225; max-width: 60ch; margin-left: auto; margin-right: auto">A new user has registered on our platform. Please review the user's details provided below and click the button below to verify the user.</p>
               <h1 style="font-size: 25px;text-align: left; color: #202225; margin-top: 0;">User Details</h1>
              <div style="text-align: justify; margin:20px; display: flex;">
                
                <div style="flex: 1; margin-right: 20px;">
                  <h1 style="font-size: 20px; color: #202225; margin-top: 0;">Full Name :</h1>
                  <h1 style="font-size: 20px; color: #202225; margin-top: 0;">Email :</h1>
                  <h1 style="font-size: 20px; color: #202225; margin-top: 0;">Phone :</h1>
                       <h1 style="font-size: 20px; color: #202225; margin-top: 0;">Profession :</h1>
                  <h1 style="font-size: 20px; color: #202225; margin-top: 0;">Institution :</h1>
                  <h1 style="font-size: 20px; color: #202225; margin-top: 0;">Department :</h1>
                </div>
                <div style="flex: 1;">
                  <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${userFind.name}</h1>
                  <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${userFind.email}</h1>
                  <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${userFind.phone}</h1>
                       <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${userFind.userType}</h1>
                  <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${userFind.institution}</h1>
                  <h1 style="font-size: 20px; color: #202225; margin-top: 0;">${userFind.department}</h1>
                </div>
              </div>
              
              <a href="${resetLink}" style="background-color: #4f46e5; color: #fff; padding: 8px 24px; border-radius: 8px; border-style: solid; border-color: #4f46e5; font-size: 14px; text-decoration: none; cursor: pointer">Verify User</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </tbody>

  </table>
  </body>


  `;
};

//sending mail for verification and verifying email
const emailVerificationLink = async (req, res, next) => {
  try {
    const email = req.body;
    if (!email) {
      return res.status(422).json({ error: "Please Provide valid email" });
    }
    const userExist = await User.findOne(email);
   // console.log(userExist)
    let token;
    if (userExist) {
      token = jwt.sign({ _id: userExist._id }, process.env.SECRET_KEY, {
        expiresIn: "1D",
      });
    }
    //console.log({"token":token})
    console.log(userExist)
    const setUserToken = await User.findByIdAndUpdate(
      userExist._id ,
      { verifytoken: token },
      { new: true }
    );
    console.log({"verofiytoken":setUserToken})
    if (setUserToken) {
      const mailOptions = {
        sender: process.env.SENDER_EMAIL,
        to: process.env.ADMIN_EMAIL,
        subject: "BOOK IT EMAIL VERIFICATION",
        html: verifyEmailTemplate(
          `http://localhost:3000/verifyemail/${userExist._id}/${userExist.verifytoken}`,
          userExist
        ),
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.status(401).json({ status: 401, message: "Email not Send" });
        } else {
          // console.log("Email Sent ",info.response);
          res.status(201).json({
            status: 201,
            message: "Email Send Successfully",
            id: userExist._id,
            usertoken: token,
          });
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
};
const verifyEmail = async (req, res, next) => {
  try {
    const { id, token } = req.params;
    const userExist = await User.findById({ _id: id, verifyToken: token });
    const validToken = jwt.verify(token, process.env.SECRET_KEY);
    if (userExist && validToken._id) {
      const setUsertoken = await User.findByIdAndUpdate(
        { _id: userExist._id },
        { emailVerified: true }
      );
      setUsertoken.save();
      res.status(201).json({
        status: 201,
        user: userExist,
        msg: "emailVerification done Successfully",
      });
    } else {
      res.status(401).json({ status: 401, error: "user not exist" });
    }
  } catch (error) {
    console.log(error);
  }
};


//logout
const logout=async(req,res,next)=>{
try {
  const {userID}=req.params
  let user=await User.findByIdAndUpdate(
    {_id:userID},
    {$unset:{tokens:1}},
    {new:true}
  )
  res.status(200).send("User logout successfully")
} catch (error) {
  console.log(error)
}
}
//other controllers
const about = async (req, res) => {
  try {
    const rootUser = req.rootUser; // This is set by the Authenticate middleware

    if (!rootUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(rootUser);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getdata=(req,res)=>{
  res.send(req.rootUser)
}
const contact = async (req, res,next) => {
  try {
    const { name, email,department, phone, message } = req.body;

    if (!name || !department || !email || !phone || !message) {
      // console.log("error in contact form");
      return res.json({ error: "Plz fill form correctly" });
    }

const userContact = await  User.findOne({_id:req.userID})

if (userContact){
  // console.log("user find");

  const userMessage = await userContact.addMessage(name,email,phone,message)
  await userContact.save();

  res.status(201).json({message:"message created"})

}

  } catch (error) {
      next(error);
  }
}


module.exports = {
  register,
  login,
  emailVerificationLink,
  verifyEmail,
  passwordLink,
  forgotpassword,
  setnewPassword,
  logout,
  about,
  getdata,
  contact
};
