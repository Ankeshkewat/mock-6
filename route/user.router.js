const express = require('express');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const UserRouter = express.Router();
const { UserModel } = require('../model/user.model')

//register route
UserRouter.post('/register', async (req, res) => {
    try {
        const { name, profile_pic, email, password, bio, phone } = req.body;
        bcrypt.hash(password, 10, async (err, hashPassword) => {
            if (err) return res.status(500).json({ 'msg': "Something went wrong" })
            let user = new UserModel({ name, email, password: hashPassword, profile_pic, bio, phone });
            await user.save();
            res.status(201).json({ "msg": "Account created succesfully" })
        })
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ 'msg': "Something went wrong" })
    }
})

//login route
UserRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(401).json({ "msg": "Please give all deatails" })
        let { _id, password: hash_pass } = await UserModel.findOne({ email });
        bcrypt.compare(password, hash_pass, async (err, succes) => {
            if (err) return res.status(401).json({ 'msg': "Wrong password" })
            else if (succes) {
                const token = jwt.sign({ id: _id, email }, process.env.secret)
                res.status(201).json({ "msg": "Login succesfull", 'token': token })
            } else {
                return res.status(401).json({ 'msg': "Wrong password" })
            }
        })
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ 'msg': "Something went wrong" })
    }
})

//get the user
UserRouter.get('/user', async (req, res) => {
    try {
       const token=req.headers?.authorization?.split(" ")[1];
       if(!token) return res.status(401).json({"msg":'Your are not authorize'})
       const {email}=jwt.decode(token)
       let user=await UserModel.find({email});
       res.status(200).send({"msg":"successfull",data:user})
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ 'msg': "Something went wrong" })
    }
})

// update details
UserRouter.patch('/edit', async (req, res) => {
    try {
       const token=req.headers?.authorization?.split(" ")[1];
       if(!token) return res.status(401).json({"msg":'Your are not authorize'})
       const {id,email}=jwt.decode(token)
       console.log(id,email)
       const newDetails=req.body
       await UserModel.findByIdAndUpdate({_id:id},newDetails)
       res.status(200).json({"msg":"Details updated"})
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ 'msg': "Something went wrong" })
    }
})


module.exports = { UserRouter }