const express =require("express");
const mongoose=require("mongoose");
require("dotenv").config();
const app = express();
const port=8000;
const User=require("./models/User");
const JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt;
const passport=require("passport");

const authRoutes=require("./routes/auth");
const songRoutes=require("./routes/song");
const playlistRoutes=require("./routes/playlist");
app.use(express.json());

//////connect node to mongodb
// 

// mongoose.connect("mongodb://adityaraj16:"+ process.env.MONGO_PASSWORD +"@ac-ti7qxvt-shard-00-00.fs2k0ht.mongodb.net:27017,ac-ti7qxvt-shard-00-01.fs2k0ht.mongodb.net:27017,ac-ti7qxvt-shard-00-02.fs2k0ht.mongodb.net:27017/?ssl=true&replicaSet=atlas-53k0nm-shard-0&authSource=admin&retryWrites=true&w=majority",
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
let opts ={};
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
        }
    });
})
);



app.get("/",(req,res)=>{
    res.send("hello world");
});

app.use("/auth",authRoutes);
app.use("/song",songRoutes);
app.use("/playlist",playlistRoutes);

app.listen(port,()=>{
    console.log("app is running on port "+port);
});