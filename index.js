const express=require('express');
const cors=require('cors')

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


app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    function (req, res) {
        const token = jwt.sign({ id: req.user._id, first_name: req.user.first_name }, process.env.secret, { expiresIn: '5 days' })
        res.redirect(`https://wondrous-biscuit-d5ba9b.netlify.app/signup?token=${token}&name=${req.user.first_name}`)
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