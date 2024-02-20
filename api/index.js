import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv"
import userRouter from "./routes/user.route.js"
import authRouter from "./routes/auth.route.js"
import listingRouter from "./routes/listing.route.js"
import cookieParser from "cookie-parser";
import path from 'path';
dotenv.config() //initialize

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connect to MongoDB");
}).catch((err)=>{
    console.log(err);
})
const __dirname = path.resolve();

const app = express() //using express create application
app.use(express.json())
app.use(cookieParser())//so we can get token fromm cookie
app.listen(3002,()=>{
    console.log('Server is running on port 3000!!!'); //create a port for backend server so app will listen to tthe port number

})

app.use('/api/user',userRouter) //userouter will check the path of useroruter.js that is test // so it ill be locallhost:3002/api/user/test
app.use("/api/auth",authRouter)
app.use("/api/listing",listingRouter)

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})



app.use((err,req,res,next)=>{    ///middleware
    const statusCode = err.statusCode || 500
    const message = err.message || "internal Server Error"
    return res.status(statusCode).json({
        success:false,
        message,
        statusCode
    })
})