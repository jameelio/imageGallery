const userModel = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


function handleNewUserSignUp(req,res,next){
  let reqName = req.body.name;
  let reqeMail = req.body.email;
  let reqPassword = req.body.password;
  userModel.create({ name: reqName, email: reqeMail, password: reqPassword },
    (err, result) => {
      if (err) next(err);
      else res.json({ status: "success" });
    }
  );
}

function authUserSignIn(req,res,next){
    userModel.findOne( { email: req.body.email },
      (err, userAuthInformation) => {
        if (err) next(err);
        else {
          if (!userAuthInformation) {
            res.json({ status: "error", message: "OOPS Invalid email/password", data: null });
            return;
          }

          if (bcrypt.compareSync(req.body.password,userAuthInformation.password)) {
            const token = jwt.sign({ id: userAuthInformation._id },req.app.get("secretKey"),{ expiresIn: "24hr" });
            res.json({ status: "success", message: "Successfully Authed", data: { user: userAuthInformation._id,images:userAuthInformation.images, token: token }});

          } else {
            res.json({ status: "error", message: "Invalid email/password!!!", data: null });
          }
        }
      }
    );
}

function userImageUpload(req,res,next){
  let data = req.body;


  if (req.file && req.file.cloudStoragePublicUrl) {
     data.imageUrl = req.file.cloudStoragePublicUrl;
  }

  userModel.findByIdAndUpdate(
    data.user,
    { $push: {images:data.imageUrl} },
    { safe: true, upsert: true },
    (err, saveImage) => {
      if (err) console.log(err,"err of insert");
      else {
        console.log(saveImage,"return of insert");
      }
    }
  );

  console.log(data.imageUrl);
  //update userDB

  res.json({ok:true,image:"success",data});
}

function userGalleryAccess(req,res,next){
  console.log("user gallert", req.body.user);
    if(!req.body.user)return next();
    const userID = req.body.user;

    console.log(userID)
    userModel.findOne({ _id:userID },(err,data)=>{
      if(err){
        res.json({ok:false,err})
        return;
      }
      console.log(data)
      res.json({ok:true,data});
    });
}


module.exports = {
  signUpUser: handleNewUserSignUp,
  signInUser: authUserSignIn,
  uploadImage: userImageUpload,
  gallery:userGalleryAccess
};