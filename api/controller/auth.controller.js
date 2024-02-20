import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import { errorHandler } from "../utils/error.js"
import  jwt from "jsonwebtoken"
export const signup = async (req, res, next) => {
    const { username, email, password } = req.body
    //to protect the password
    const hashedPassword = bcryptjs.hashSync(password, 10)
    const newUser = new User({ username, email, password: hashedPassword }) //create signup
    try {
        await newUser.save() // it ill save to database
        res.status(200).json("User Craeted Successfully")
    } catch (err) {
        next(err)
    }
}

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ email })
        if (!validUser)
            return next(errorHandler(404, 'User not found'))
        // check the password and compare bwetwwen database and which typed in the frontend that is in the req body
        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if (!validPassword)
            return next(errorHandler(403, "wrong credentials"))
        const token = jwt.sign({id:validUser._id},process.env.JWT_SECRET)
        const {password : pass,...rest} = validUser._doc // so here we hide the pasword by destrcuting from valid user._id and showing the rest which will be be getting from  here
        res  
        .cookie('access_token',token,{httpOnly:true})
        .status(200)
        .json(rest) 
        //save the token through cookie this will be a session
    } catch (error) {
        next(error)
    }
}
export const google = async(req,res,next)=>{
    try {
        const user = await User.findOne({email:req.body.email});
        if(user){
            const token=jwt.sign({id:user._id}, process.env.JWT_SECRET);//  login with user
            const {password:pass,...rest} = user._doc;
            res
            .cookie( "access_token", token , { httpOnly : true })
            .status(200)
            .json(rest)
        }else{ //create an user
            //normally we reuqired pasword but when we do through google we dont give password so we have to generate a password
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8) //random numbers based to 36 means 0 to 9 and a to z and should get last 8 digits
            //hashed password
            const hashedPassword = bcryptjs.hashSync(generatedPassword,10)
            const newUser = new User({
                username:req.body.name.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-4),email:req.body.email,password:hashedPassword,profilepic:req.body.photo
            })
            await newUser.save()
            const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET)
            const {password:pass,...rest} = newUser._doc
            res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest)
        }
    } catch (error) {
        next(error)
    }
}
export const signOut = async(req,res,next)=>{
    try {
        res.clearCookie('access_token')
        res.status(200).json("User Has been Logged Out!!")
    } catch (error) {
        next(error)
    }
}

