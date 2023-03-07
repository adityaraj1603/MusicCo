const express =require("express");
const mongoose=require("mongoose");
require("dotenv").config();
const app = express();
const port=8000;
const User=require("./models/User");
var JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt;
const passport=require("passport");

//////connect node to mongodb

mongoose.connect("mongodb+srv://adityaraj16:"+ process.env.MONGO_PASSWORD +"@cluster0.fs2k0ht.mongodb.net/?retryWrites=true&w=majority",
{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}
)
.then((x)=>{
    console.log("connected to mongo!");
 })
 .catch((err)=>{
    console.log("error while connecting to mongo");
 });



 /////// setup passport jwt
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_KEY;
passport.use(
    new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({id: jwt_payload.sub}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));



app.get("/",(req,res)=>{
   ///cliet send req to the server stored in req variable 
    //and server respond it which is stored in req variable
    res.send("hello world");
});

app.listen(port,()=>{
    console.log("app is running on port "+port);
})


