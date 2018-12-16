const express = require('express');
//hbs is handlebars
const hbs = require('hbs');

const fs = require('fs')
//get environment variable port for heroku to dynamically assign a port
//process.env is variable which store all the environment variables in KVP
//if port doesn't exist then set it to 3000(to use it locally)
const port = process.env.PORT || 3000;
var app = express();
//registering the partials. Means from below directory app will look for partials
hbs.registerPartials(__dirname + '/views/partials')
//KVP to set express related configurations. Below tells node to use hbs view engine
app.set('view engine', 'hbs');



//app.use is always used to register a middle ware and ita takes one arguement as above where express.static() function was used
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}-${req.method}-${req.url}`
    console.log(log)
    // fs.appendFileSync('server.log', log+'\n')
    //apeendFile vs appendFileSync
    //as name suggestes, appendFileSync writes data synchronously while appendFile in async way
    //also appendFiel takes 3 args 1. filename 2. data 3. a call back to handle errors
    fs.appendFile('server.log', log+'\n',(err) =>{
        if (err){
            console.log(err);
        }
    })
    next();
})

//maintainance middle ware
// app.use((req,res,next) =>{
//     res.render('maintainance.hbs',{
//         pageTitle: 'Maintainance In Progress'
//     })
// })

//adding middleware function
// using to server the data in the public folder
app.use(express.static(__dirname + '/public'));

//registering a  partial helper. This helps is creating functions which can be used any where
// it takes 2 args 1. name of the function 2. the function
hbs.registerHelper('getCurrentYear',()=>{
    return new Date().getFullYear();
});

//we can even pass arguements to helper as below. If the arguement passed to the helper is a partial then t can be doen as
//{{screamIt welcomeMessage}}, see no need to give brackets
hbs.registerHelper('screamIt',(text)=>{
    return text.toUpperCase();
})



//registering a handler for http get request
//get has 2 args 1. URL, '/'- means root 2. a call back with 2 args request and response
// app.get('/',(req,res) => {
//     res.send('<h1>heelo express!</h1>')
// });


// app.get('/',(req,res) =>{
//     res.send({
//     name: 'Ashish',
//     likes:  [
//         'food',
//         'success',
//         'gym'
//     ]   
//     })
// })


app.get('/',(req,res)=>{
    res.render('home.hbs',{
        pageTitle: 'About Page',
        //removing currentYea and using helper instead
        // currentYear: new Date().getFullYear(),
        welcomeMsg: 'Welcome to my first node Web App!!'
    })
})

// app.get('/about',(req,res) =>{
//     res.send('About page')
// })
//use hbs view engine instead
app.get('/about',(req,res) =>{
    res.render('about.hbs',{
        pageTitle: 'About Page'
        //removing currentYea and using helper instead
        // currentYear: new Date().getFullYear(),
    })
})



app.get('/bad', (req, res) => {
    res.send({
        error: 'bad call',
        status: 401
    })
})
//port to listen app
//it takes 2 args 1. port number 2. A method which can be used for anything once server is up
app.listen(port,() =>{
    console.log(`Server is up on port ${port}`);
});

// start script in package.json will be used by heroku to start the app, which in turns will run server.js

