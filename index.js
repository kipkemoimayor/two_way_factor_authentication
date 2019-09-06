const createErrors=require("http-errors");
const express=require("express");
const path =require("path");
const session = require('express-session');
const logger= require("morgan");
const app = express();
const http = require("http").createServer(app);

const router= require("./router");


const port= process.env.port || 3000;

app.set("port",port);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.use(logger("dev"));
app.use(express.json());
app.use(session({
    secret:"XBHWYGHVSH",
    resave:false,
    saveUninitialized:true
}));

app.use(express.urlencoded({extended:false}));
app.use(router);

app.use((req,res,next)=>{
    next(createError(404));
});

app.use((err,req,res,next)=>{
    res.locals.message=err.message
    res.locals.error=req.app.get("env")==='development' ? err:{};
    res.status(err.status||500);
    res.render("error")
})

http.listen(port,_=>{
    console.log(`Started server running on port ${port}`);
    
})
