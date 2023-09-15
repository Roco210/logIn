//generic
import express from 'express';
import { __dirname } from "./utils.js";
import session from 'express-session';
import cookieParser from 'cookie-parser';

// dao
import { URI } from './utils.js';
import './dao/dbConfig.js';
import MongoStore from 'connect-mongo';


//handlebars
import { engine } from "express-handlebars";


// server
import { Server } from "socket.io";
import { productMongo } from './manager/product/productManagerMongo.js';
import { msjModel } from './manager//messages/messagesManager.js';


//endpoints
import porductsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from "./routes/views.router.js";
import userRouter from './routes/user.router.js';
import passport from 'passport';


//server
const app = express()
const PORT = 8080
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));

//handlebars
app.engine('handlebars', engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');


//session
app.use(session({
    store: MongoStore.create({
        mongoUrl: URI,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 600
    }),
    secret: "secret",
    resave: false,
    maxAge: 600 * 10,
    saveUninitialized: false,
}))

//passport

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) =>{
     process.nextTick( () =>{
        return done(null, {
            id: user._id,
            username: user.first_name,
        });
    });
});

passport.deserializeUser( (user, cb)=> {
    process.nextTick( () =>{
        return cb(null, user);
    });
});


//endpoints
app.use('/api/products', porductsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/user', userRouter);
app.use("/", viewsRouter);




//conect
const httpServer = app.listen(PORT, () => {
    console.log(`Escuchando puerto ${PORT}`)
})
const socketServer = new Server(httpServer)

socketServer.on('connection', async (socket) => {
    console.log(`Se conecto ${socket.id}`)
    socket.on('disconnect', () => {
        console.log(`Se desconecto ${socket.id}`)
    })

    const allprod = await fetch('http://localhost:8080/api/products')
    const getProd = await allprod.json()
    const allProds = getProd.payload
    socketServer.emit('allProds', allProds)

    socket.on("msj", async (e) => {
        console.log(e)
        await msjModel.createMsj(e)
        const listmsjs = await msjModel.findMsj()
        socketServer.emit("msjs", listmsjs)
    })
})




