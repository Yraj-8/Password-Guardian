const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { generateToken } = require("../jwt");

//signup route
router.post("/signup",async (req,res)=>{
try {
    const {username,email,password}=req.body;
    const existingUser=await User.findOne({email});
    if(existingUser) return res.status(400).json({ error: "User already exists" });
    const user = new User({ username, email, password });
    await user.save();
    
    const token = generateToken(user);
    res.json({ message: "Signup successful", token });
} catch (error) {
 res.status(500).json({ error: "Server error" });

}
})
 // login route 
 router.post("/login",async (req,res)=>{
    try {
        const {email,password}=req.body;
        const user= await User.findOne({email});
        if(!user) return res.status(400).json({error:"Invalid email or password"});
         const isMatch= await user.comparePassword(password);
         if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });
         const token = generateToken(user);
         res.json({ message: "Login successful", token });


    } catch (error) {
            res.status(500).json({ error: "Server error" });

    }

 })
 module.exports = router;
