import passport from "passport";
import {Strategy as localStrategy} from "passport-local";
import githubStrategy from "passport-github2";
import { userModel } from "../dao/models/user.model.js";
import { userMongo } from "../manager/user/userManagerMongo.js";
import {compareHash } from "../utils.js";



// strategy

/* passport.use("local", new localStrategy(
    async (username, password, done) => {
        console.log("hola")
        try {
            const userDb = await userModel.findUser(username)

            if (!userDb) {
                return done(null, false)
            } 
            const passwordCheck = await compareHash(password, userDb.password)
            if (!passwordCheck) {
                return done(null, false)
            }
            return done(null, userDb)
        }
        catch (error) { done(error) }
    }))
 */


 
passport.use(new githubStrategy(
    {clientID: 'Iv1.a5948c138fda0bf0',
    clientSecret: 'f241c801c0b2e3229f46eb5fe5dd929882a6f2d9',
    callbackURL:'http://localhost:8080/api/user/github'},
    async function (accessToken, refreshToken, profile, done) {
            try {
                const userbd = await userMongo.findUser(profile._json.email)
                if(userbd){
                    console.log("user exist")
                    return done(null, userbd)
                } 
                const newUser={
                    first_name: profile.displayName.split(" ")[0],
                    last_name: profile.displayName.split(" ")[1],  
                    username: profile.username, 
                    email: profile._json.email,
                    password: " ", 
                    githubLog:"true"}
                    console.log(newUser)
                await userMongo.createUser(newUser)
                console.log(newUser)
                return  done(null, newUser)}
            
            catch(error){done(error)}}
))

//serial and deserial User
passport.serializeUser((user, done) => {
    done(null, user);
        });
    
    passport.deserializeUser(async (id, done) => {
        try {
            const user= await userModel.findOne(id)
            done(null, user);
        }
        catch (error) { done(error)}
        });
    


