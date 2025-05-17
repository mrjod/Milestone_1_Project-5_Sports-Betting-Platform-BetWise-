const express = require("express")
const mongoose = require ("mongoose")
const bycrypt = require("bcryptjs")
const dotenv = require("dotenv")
const jwt = require("jsonwebtoken")
const User = require("./userModel")
const Game = require("./gameModel")

dotenv.config()
const app = express ()

app.use(express.json())



const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log("MongoDB connected...");
    
    app.listen(PORT, ()=>{
        console.log(`Server started on Port ${PORT} `);
})
})

//api to register users 
app.post("/auth/register", async (req,res )=>{

    try{
        const {email, password, firstname, lastname,age, isAdmin} = req.body
        //validate email
        if(!email){
            return res.status(400).json({message:"please input your Email address"})
        }
        //validate Password
        if(!password){
            return res.status(400).json({message:"please input your password"})
        }
        //validate password length
        if(password.length < 6){
            return res.status(400).json({message:"Your password should not be less than 6 characters"})
        }
        //validate user age 
        if(age < 18){
            return res.status(400).json({message:"You are underaged and cannot register"})
        }

        //validate if user already exists
        const existingUser = await User.findOne({email})

        if(existingUser){
            return res.status(400).json({message:"User Account Already Exists"})

        }
        // hash the password
        const hashedPassword =await bycrypt.hash(password, 12)

        const newUser = new User ({
            email, 
            password:hashedPassword, 
            firstname, 
            lastname,
            age, 
            isAdmin
        })
        //store new user in the Database
        await newUser.save()

        res.status(201).json({
            message:"User Account created succesfully ",
            newUser
        })
    }
    catch (error){
        return res.status(500).json({message: error.message})

    }
    


})

//api for login 
app.post("/auth/login", async (req,res )=>{

    try {
        const {email, password} = req.body

    const user = await User.findOne({email})

    if(!user){
        return res.status(404).json({message:"User Account does not Exist"})

    }

    const isMatch = await bycrypt.compare(password, user?.password)

    if(!isMatch){
        return res.status(400).json({message:"Incorrect Email or password"})

    }

    const accessToken = jwt.sign(
        {id:user?._id},
        process.env.ACCESS_TOKEN,
        {expiresIn: "5m"}

    )
    const refreshToken = jwt.sign(
        {id:user?._id},
        process.env.REFRESH_TOKEN,
        {expiresIn: "5d"}

    )

    res.status(200).json({
        message:"User Login  succesfully ",
        accessToken,
        refreshToken,
        user
    })
        
    } catch (error) {
        return res.status(500).json({message: error.message})
        
    }

})

//Api for Admin to post games
app.post("/games", async (req, res)=>{
    try {
        
        const {league,hometeam,awayTeam,odds,gameDate,result} = req.body
        // const { id } = jwt.verify(accessToken,process.env.ACCESS_TOKEN,)
        // const user = await User.findById(id);
        // if(user?.isAdmin == false){
        //     return res.status(400).json({message:"you are not authorized to perfrom this Action"})
        // }

        if(!league){
            return res.status(400).json({message:"Please input the league"})

        }
        if(!hometeam){
            return res.status(400).json({message:"Please input the home team"})

        }

        if(!awayTeam){
            return res.status(400).json({message:"Please input the away team"})

        }
        if(!gameDate){
            return res.status(400).json({message:"Please input the Game date and time "})

        }
         const findGame = await Game.findOne({hometeam,awayTeam,gameDate})

        if(findGame){
            return res.status(400).json({message:"Game already exist"})


         }


        const newGame = new Game ({league,hometeam,awayTeam,odds,gameDate,result})

        await newGame.save()

        res.status(201).json({
            message:"Game created successfully ",
            newGame
        })
        
    } catch (error) {
        return res.status(500).json({message: error.message})
        
        
    }

})

app.get("/games", async (req, res)=>{
    const allGames = await Game.find()
    res.status(200).json({
        message:"success ",
        allGames
    })

})