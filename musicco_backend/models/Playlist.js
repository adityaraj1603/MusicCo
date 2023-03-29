const mongoose=require("mongoose");

const Playlist=new mongoose.Schema({
    name:{
     type: String,
     required:true,  
    },
    thumbnail:{
        type:String,
        required:true,
    },
    owner:{
        type:mongoose.Types.ObjectId,
        ref:"user",
    },
    songs:[
        {   
        type: mongoose.Types.ObjectId,
        ref:"song",
        },
    ],
    collaborators:[
        {
        type:mongoose.Types.ObjectId,
        required: true,
    },
    ],
});

const PlaylistMode= mongoose.model("Playlist",Playlist);
module.exports=PlaylistMode;
