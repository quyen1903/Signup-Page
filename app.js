const express = require("express");
const bodyParser = require('body-parser');
const request = require('request');
const https = require('node:https');


const app = express();


//in order for server to serve static file, we need use static function of express

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//app.get() function to route HTTP GET request to path which being specify with callback(middleware)
app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/signup.html")
})
//app.post send messege to server
app.post("/",(req,res)=>{    
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    console.log("First Name:", firstName);
    console.log("Last Name:", lastName);
    console.log("Email:", email);

    const data = {
        
        members: [
            {
                email_address: email,
                status:"subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);//convert value into JSON string 
    const url = 'https://us21.api.mailchimp.com/3.0/lists/b9cba481bc';
    //option of https is object
    const option = {
        method: 'POST',//this string specify HTTP request method. This time is POST(by default is GET)
        auth: 'dev:563f1bf6456aa7575bc286f43e56eab9-us21'//basic authenticate to compute authorize header 
    };
    //Makes a request to a secure web server.
    const request = https.request(url,option,(response)=>{
        var status = response.statusCode;
        if(status == 200){
            res.sendFile(__dirname+"/success.html")
        }else{
            res.sendFile(__dirname+"/failure.html")
        }
        
        response.on("data",(data)=>{
            console.log(JSON.parse(data))
        })
    })
    //those 2 method belong to http.ClientRequest class of nodejs
    request.write(jsonData);//send chunk of the body. this method could be call multi time
    request.end();//finish sending request
    
});

app.post("/failure.html",(req,res)=>{
    res.redirect("/");
})
//server listen on port300
//process module of nodejs provide env(enviroment) property
//env host all enviroment variable 
//this code allows host on the internet(find out more later)
app.listen(process.env.PORT || 3000, ()=>{
    console.log("Server is running on port 3000");
})

//API key
//563f1bf6456aa7575bc286f43e56eab9-us21


//list ID  
//b9cba481bc