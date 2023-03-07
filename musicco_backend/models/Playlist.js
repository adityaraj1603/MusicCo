const mongoose=require("mongoose");

const Playlist=new mongoose.Schema({
    name:{
     type:String,
     required:true,  
    },
    thumbnail:{
        type:String,
        required:true,
    },
    track:{
        type:String,
        required: true,
    },
    songs:{
        type:String,
       ref:songs
 
     },
    artist:{
        type : mongoose.Types.ObjectId,
        ref:"User",
    },



});

const PlaylistMode= mongoose.model("'Playlist",Playlist);
module.exports=PlaylistMode;
