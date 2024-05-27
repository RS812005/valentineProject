const mongoose=require("mongoose");

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    rollNo:{
        type:String,
        require:true
    },
    sendBy:[String],
    sendTo:[String],
    heartsRecived:{
        type:Number
    },
    heartsRemaining:{
        type:Number
    },
    matches:{
        type:Number
    },
    matchedName:[String],
    matchedRollNo:[String]
    
    
})
const User = mongoose.model("user", UserSchema);

module.exports=User;