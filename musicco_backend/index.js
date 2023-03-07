const express =require("express");
const app = express();
const port=8000;

//api : get type 
app.get("/",(req,res)=>{
   ///cliet send req to the server stored in req variable 
    //and server respond it which is stored in req variable
    res.send("hello world");
});
app.listen(port,()=>{
    console.log("app is running on port "+port);
})


