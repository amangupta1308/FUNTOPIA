const express = require('express');
const app = express();
const User = require('./models/customer');
const Service = require('./models/services');
const Sport = require('./models/sports');
const Food = require('./models/foods');
const Art = require('./models/art');
const bcrypt = require('bcryptjs');
const path = require('path');
const hbs = require('hbs');
const staticPath = path.join(__dirname, '../public');
const viewPath = path.join(__dirname, "../templates/views");
const partialPath = path.join(__dirname, '../templates/partials');
app.use(express.static(staticPath));
app.set('view engine', 'hbs');
app.set('views', viewPath);
app.use(express.urlencoded({extended:false}));
app.use(express.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser());
hbs.registerPartials(partialPath);
require('dotenv').config();
const auth = require('./middleware/auth');
require('./db/conn');

// HOME
app.get('/', async (req, res)=>{
    try{
        res.render('index');
    } catch(e){
        res.status(401).send(e);
    }
})

// REGISTER
app.get('/register', async (req, res)=>{
    try{
        res.render('register');
    } catch(e){
        res.status(401).send(e);
    }
})

app.post('/register', async (req, res)=>{
    try{
        if(req.body.password===req.body.conf_password){
            const new_user = new User(req.body);
            new_user.conf_password = undefined;
            new_user.password = await bcrypt.hash(new_user.password, 10);
            const token = await new_user.generateAuthToken();
            res.cookie("jwt", token,{
                httpOnly: true,
                expires: new Date(Date.now()+1000000)
            });
            await new_user.save();
            res.status(201).redirect('/login');
        }
        else
            res.send('Password not matching');
    } catch(e) {
        res.status(400).send(e);
    }
})

// LOGIN
app.get('/login', async (req, res)=>{
    try{
        res.render('login');
    } catch(e){
        res.status(401).send(e);
    }
})

app.post('/login', async (req, res)=>{
    try{
        const user = await User.findOne({email: req.body.email});
        if(!user) res.send("Invalid email");
        else {
            
            const passCheck = await bcrypt.compare(req.body.password, user.password);
            if(passCheck) 
            {
                const token = await user.generateAuthToken();
                res.cookie("jwt", token,{
                    httpOnly: true,
                    expires: new Date(Date.now()+1000000)
                });
                // console.log(token);
                res.redirect('/loginned');
            }
            else res.send("Invalid password");
        }
    } catch(e){
        res.status(401).send(e);
    }
})

// LOGINNED
app.get('/loginned', auth, async (req, res)=>{
    try{
        // console.log(req.user);
        res.render('loginned');
    } catch(e){
        res.status(401).send(e);
    }
})

// LOGOUT
app.get('/logout', auth, async (req, res)=>{
    try{
        req.user.tokens = [];
        res.clearCookie("jwt");
        await req.user.save();
        res.render('login');
    } catch(e){
        res.status(401).send(e);
    }
})

// SERVICES
app.get('/services', auth, async (req, res)=>{
    try{
        const ride_data = await Service.find();
        const sport_data = await Sport.find();
        const food_data = await Food.find();
        const art_data = await Art.find();
        res.render('services', {
            data_r: ride_data, 
            data_s: sport_data, 
            data_f: food_data, 
            data_a: art_data
        });
    } catch(e){
        res.status(401).send(e);
    }
})

// ADD TO CART
app.get('/add_cart/:sid', auth, async (req, res)=>{
    try{
        const sid = req.params.sid;
        if(sid>=1 && sid<=8){
            const ride_data = await Service.findOne({sid});
            res.render('add_cart', {
                data: ride_data,
            })
        }
        else if(sid>=9 && sid<=14){
            const sport_data = await Sport.findOne({sid});
            res.render('add_cart', {
                data: sport_data,
            })
        }
        else if(sid>=21 && sid<=24){
            const art_data = await Art.findOne({sid});
            res.render('add_cart', {
                data: art_data,
            })
        }
        else if(sid>=15 && sid<=20){
            const food_data = await Food.findOne({sid});
            res.render('add_cart', {
                data: food_data,
            })
        }
        else res.send("Invalid request!");
    } catch(e) {
        res.status(401).send(e);
    }
})

app.post('/add_cart/:sid', auth, async (req, res)=>{
    try{

        // This is another method of getting all details (since we did hidden inut fields in /add_cart so were able to get sid, name, cost of service)
        // const ssid = req.params.sid;
        // const service = await Service.findOne({sid: ssid});
        req.user.cart = req.user.cart.concat({
            sid: req.body.sid,
            name: req.body.sname,
            img_add: req.body.imga,
            cost: req.body.price,
            quantity: req.body.quantity,
            price: req.body.cost*req.body.quantity,
            extra: req.body.extra
        })
        req.user.t_price = req.user.t_price + req.body.cost*req.body.quantity;
        await req.user.save();
        res.redirect('/services');
    } catch(e) {
        res.status(401).send(e);
    }
})

// CHECKOUT
app.get('/final', auth, async (req, res)=>{
    try{
        res.render('final', {
            data: req.user
        });
    } catch(e) {
        res.status(401).send(e);
    }
})
app.listen(process.env.PORT, () => console.log(`Listening at port ${process.env.PORT}`));