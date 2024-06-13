const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Session for customer
app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

// Authentication for customer
app.use("/customer/auth/*", function auth(req,res,next){
    // Check if the jwt token is valid
    const token = req.session.token;
    if(token){
        // Verify the token
        jwt.verify(token, "token_customer" , (err, user)=>{
            if(!err){
                // Forward the request to the corresponding controller
                req.user = user;
                next();
            } else {
                // The token is invalid
                return res.status(401).json({message: "Invalid Token"});
            }
        });
    } else {
        // The token is missing
        return res.status(401).json({message: "Unauthorized User"});
    }    
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
