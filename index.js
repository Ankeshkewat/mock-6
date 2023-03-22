const express=require('express');
const cors=require('cors')
const jwt=require('jsonwebtoken')
require('dotenv').config()

const app=express();
const {Connection}=require('./config/db')
const {passport}=require('./config/google-Oauth')


app.use(express.json())
app.use(cors())

const {UserMiddleware}=require('./middleware/user.middleware')
const {UserRouter}=require('./route/user.router')

app.get('/',(req,res)=>{res.send('This is the base router of this project')})
app.post('/register',UserMiddleware,UserRouter)
app.post('/login',UserRouter)
app.get('/user',UserRouter)
app.patch('/edit',UserRouter)


app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    function (req, res) {
        const token = jwt.sign({ id: req.user._id,email: req.user.email }, process.env.secret, { expiresIn: '5 days' })
        res.redirect(`https://ankeshkewatmock6.netlify.app/index.html?token=${token}`)
    });


app.listen(8000,async()=>{
  try{
  await Connection
  console.log('Connected to the database')
  }
  catch(err){
    console.log(err)
  }
})