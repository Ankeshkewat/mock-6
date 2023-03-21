require('dotenv').config()
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport')
const { v4: uuidv4 } = require('uuid');

const {UserModel}=require('../model/user.model')

passport.use(new GoogleStrategy({
    clientID: process.env.clientId,
    clientSecret: process.env.clientSecret,
    callbackURL: "https://fuzzy-clam-blazer.cyclic.app/auth/google/callback"
},
    async function (accessToken, refreshToken, profile, cb) {
        const email = profile._json.email
        const isAlreadyExist = await UserModel.findOne({ email })

        if (isAlreadyExist) {
            return cb(null, isAlreadyExist)
        }
        const name = profile.displayName
        const password = uuidv4()
        const profile_pic=profile._json.picture
        const user = new UserModel({ name, email, password ,profile_pic})
        await user.save()
     
        return cb(null, user);

    }
));

module.exports = { passport }