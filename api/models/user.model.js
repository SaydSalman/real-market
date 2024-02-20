import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String, 
        required:true,
        unique:true,
    },
    email:{
        type:String, 
        required:true,
        unique:true,
    },
    password:{
        type:String, 
        required:true
        
    },
    profilepic:{
        type: String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTigD4EteExGKG-P3xH--zRWewzym-uf6QwTKYbiW04KQ&s"
    }
},{timestamps:true}) // database can know the time when user created

const User = mongoose.model('User',userSchema)

export default User;
    