const express =require("express");
const router= express.Router();

var AfricasTalking = require('africastalking');

var africastalking= new AfricasTalking({
    username:"sandbox",
    apiKey:"a7a19e14e736b57b3e400fee280f631bcf3b981fcad3d63fa9b215b90b09ec28"
});

var sms=africastalking.SMS;

const CONFIG_USERNAME= 'collo';
const CONFIG_PASSWORD='COLLO';

var CONFIG_PHONE_NUMBER='+254715775170';
var CONFIG_VERIFICATION_CODE = '';


router.get("/",(req,res,next)=>{
    if(Object.is(req.session.loggedIn,true)){
        res.render('index',{
           title:"Two factor auth",
           welcomeTitle:"please enter your code",
           message:"success" 
        });
    }else{
        res.redirect("/login")
    }
})

router.get("/login",(req,res,next)=>{
    if(Object.is(req.session.loggedIn,true)){
        res.redirect("/")
    }else{
        res.render('login',{title:"Two factor authentication"})
    }
});

router.post("/login",(req,res)=>{
    var username=req.body.username;
    var password=req.body.password;
    console.log(username,password);
    
    if(Object.is(username,CONFIG_USERNAME) && Object.is(password,CONFIG_PASSWORD)){
        req.session.sendVerification=true;
        req.session.sendVerificationFailed=false;        
        res.redirect("/verify")
    }else{
        res.redirect("/login")
    }
})



router.get("/verify",(req,res,next)=>{
    // res.sendFile(__dirname+'/views/verify.hbs')
    if(Object.is(req.session.loggedIn,true)){
        res.redirect("/")
    }else{        
        if(Object.is(req.session.sendVerification,true) && Object.is(req.session.sendVerificationFailed,false)){
            sendVerificationCode()
        }
        res.render("./verify",{title:"Verify 2factor"});
    }
});

const sendVerificationCode=_=>{
    var randomNumber=Math.floor(1000+Math.random()*9000);
    CONFIG_VERIFICATION_CODE="VC-"+randomNumber;

    var message="Your verification code is: "+CONFIG_VERIFICATION_CODE;

    console.log(message);
    sms.send({
        to:CONFIG_PHONE_NUMBER,
        message:message
    }).then(
        response=>console.log(response),
        error=>console.log("Error:",error) 
    )  
}

router.post("/verify",(req,res)=>{
    var code=req.body.code;
    if(Object.is(code,CONFIG_VERIFICATION_CODE)){
        req.session.loggedIn=true;
        delete req.session.sendVerification
        delete req.sendVerificationFailed

        CONFIG_VERIFICATION_CODE='';
        res.redirect("/");
    }else{
        req.session.sendVerificationFailed=true
        res.redirect("/verify")
    }
})

router.post("/logout",(req,res,next)=>{
    delete req.session.loggedIn
    res.redirect("/")
});
module.exports=router