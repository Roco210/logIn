
import { Router } from "express";
import { userMongo } from "../manager/user/userManagerMongo.js";
import session from "express-session";  
import MongoStore from "connect-mongo";
import { URI } from '../utils.js';

const router = Router()

router.use(session({
    store: MongoStore.create({
        mongoUrl: URI,
        mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
        ttl: 600
    }),
    secret: "secret",
    resave:false,
    saveUninitialized:false,
}))

router.get('/', async (req, res) => {
    res.render('sesion')
    
});

router.get('/login', async (req, res) => {
    res.render('login');
});

router.get('/index', async (req, res) => {
    const email = req.session.email
    if (!email) {
        res.redirect('/login')
    }else{
    const user = await userMongo.findUser(email)
    const admin = user.isAdmin ? "ADMIN" : "USER"
    const cook = [{
        first_name: user.first_name,
        rol: admin
    }]
    res.render("index", { cook });}
})


router.get('/allproducts', async (req, res) => {
    const allprod = await fetch('http://localhost:8080/api/products')
    const getProd = await allprod.json()
    const allProds = getProd.payload
    const allProdMap = allProds.map(e => ({
        _id: e._id,
        title: e.title,
        description: e.description,
        code: e.code,
        price: e.price,
        stock: e.stock,
        category: e.category
    }))
    res.render("home", { allProdMap })
});


router.get('/realTimeProducts', (req, res) => {

    res.render('realTimeProducts')
})

router.get('/message', (req, res) => {

    res.render('message')
})

router.get('/cart', async (req, res) => {
    const cart = await fetch('http://localhost:8080/api/carts/64f0084c102e954bf361aae0')
    const getCart = await cart.json()
    const allprod = getCart.products
    const allProdMap = allprod.map(e => ({
        prodId: e.prodId,
        quantity: e.quantity
    }))
    res.render('cartId', { allProdMap })
})


router.get('/logout', (req, res) => {
    
})


export default router