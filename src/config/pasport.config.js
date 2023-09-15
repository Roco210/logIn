import passport from "passport";
import LocalStrategy from "passport-local";
import { userModel } from "../dao/models/user.model";
import { userMongo } from "../manager/user/userManagerMongo";
import { hashdata, compareHash } from "../utils.js";




passport.serializeUser((user, done) => {
done(null, usuario._id);
    });

passport.deserializeUser(async (id, done) => {
    try {
        const user= await userModel.findbyid(id)
        done(null, user);
    }
    catch (error) { done(error)}
    });


passport.use("local",new LocalStrategy(
    async function (username, password, done) {
    const userDb = await userMongo.findUser(username);
    
}))
